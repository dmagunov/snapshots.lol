import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsOutput,
  PutObjectOutput,
} from "@aws-sdk/client-s3";
import fsSync, { promises as fs } from "fs";
import path from "path";
import { Blob } from "@web-std/blob";
import {
  bufferToArrayBuffer,
  blobToBuffer,
  arrayBufferToBuffer,
} from "./utils";

const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY!;
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY!;
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL!;

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL!;
const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST!;

const LOCAL_FOLDER_PATH_PREFIX = path.join(process.cwd(), "/public/snapshots");
const LOCAL_FOLDER_URL_PREFIX = `http://${NEXT_PUBLIC_HOST}/snapshots`;

const CACHE_FOLDER = "cache";
const PREVIEW_FOLDER = "preview";
const META_FILE_NAME = "meta.json";
const SNAPSHOT_FILE_NAME = "snapshot.json";
const SCREENSHOT_FILE_NAME = "image.png";

export default class API {
  static dev: boolean = process.env.NODE_ENV === "development";

  static async takeSnapshotScreenshot(url: string): Promise<Blob | null> {
    let response = await fetch(SCREENSHOT_API_URL, {
      method: "POST",
      body: JSON.stringify({
        url,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to take screenshot");
    }

    let contentType = response.headers.get("content-type");

    if (contentType?.indexOf("text/plain") !== -1) {
      let json = await response.json();
      let buffer = Buffer.from(json.body, "base64");
      return new Blob([bufferToArrayBuffer(buffer)], {
        type: json.headers["Content-Type"],
      });
    }

    return await response.blob();
  }

  static async createSnapshotScreenshot(
    snapshotId: string,
    snapshotUrl: string
  ): Promise<string> {
    let blob = await API.takeSnapshotScreenshot(snapshotUrl);

    if (API.dev) {
      let filePath = `/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
      const buffer = await blobToBuffer(blob);
      await LocalFolder.saveFile(filePath, buffer);
      return LocalFolder.getFileUrl(filePath);
    }

    let data = await blob.arrayBuffer();
    let key = `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
    await S3.saveObject(key, arrayBufferToBuffer(data));
    return S3.getObjectUrl(key);
  }

  static getSnapshotScreenshotUrl(snapshotId: string): string {
    return API.dev
      ? LocalFolder.getFileUrl(`${snapshotId}/${SCREENSHOT_FILE_NAME}`)
      : S3.getObjectUrl(
          `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`
        );
  }

  static async getSnapshotScreenshot(
    snapshotId: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    let url = API.dev
      ? LocalFolder.getFileUrl(`${snapshotId}/${SCREENSHOT_FILE_NAME}`)
      : S3.getObjectUrl(
          `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`
        );

    let response = await fetch(url);
    return response.body;
  }

  static async saveSnapshotMeta(
    snapshotId: string,
    meta: string
  ): Promise<string> {
    if (API.dev) {
      let filePath = `${snapshotId}/${META_FILE_NAME}`;
      await LocalFolder.saveFile(filePath, meta);
      return LocalFolder.getFileUrl(filePath);
    }

    let key = `${CACHE_FOLDER}/${snapshotId}/${META_FILE_NAME}`;
    await S3.saveObject(key, meta);
    return S3.getObjectUrl(key);
  }

  static async saveSnapshot(snapshotId: string, meta: string): Promise<string> {
    if (API.dev) {
      let filePath = `${snapshotId}/${SNAPSHOT_FILE_NAME}`;
      await LocalFolder.saveFile(filePath, meta);
      return LocalFolder.getFileUrl(filePath);
    }

    let key = `${PREVIEW_FOLDER}/${snapshotId}/${SNAPSHOT_FILE_NAME}`;
    await S3.saveObject(key, meta);
    return S3.getObjectUrl(key);
  }

  static async getSnapshots(): Promise<(string | undefined)[]> {
    return API.dev
      ? await LocalFolder.listFolders(
          LOCAL_FOLDER_PATH_PREFIX,
          `/${META_FILE_NAME}`
        )
      : await S3.listObjects(`${CACHE_FOLDER}/`);
  }

  static async getSnapshotMeta(snapshotId: string): Promise<JSON> {
    return API.dev
      ? await LocalFolder.getFile(`${snapshotId}/${META_FILE_NAME}`)
      : await S3.getObject(`${CACHE_FOLDER}/${snapshotId}/${META_FILE_NAME}`);
  }

  static async getSnapshot(snapshotId: string): Promise<JSON> {
    return API.dev
      ? await LocalFolder.getFile(`${snapshotId}/${SNAPSHOT_FILE_NAME}`)
      : await S3.getObject(
          `${PREVIEW_FOLDER}/${snapshotId}/${SNAPSHOT_FILE_NAME}`
        );
  }
}

class LocalFolder {
  static getFileUrl(filePath: string): string {
    return `${LOCAL_FOLDER_URL_PREFIX}/${filePath}`;
  }

  static async saveFile(filePath: string, data: any): Promise<void> {
    const fullPath = path.join(LOCAL_FOLDER_PATH_PREFIX, filePath);

    if (!fsSync.existsSync(path.dirname(fullPath))) {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
    }
    return await fs.writeFile(fullPath, data);
  }

  static async listFolders(
    prefix: string,
    postfix: string
  ): Promise<(string | undefined)[]> {
    let folders = await fs.readdir(prefix);

    return folders.filter((dir) =>
      fsSync.existsSync(`${prefix}/${dir}${postfix}`)
    );
  }

  static async getFile(filePath: string): Promise<JSON | null> {
    try {
      const fullPath = path.join(LOCAL_FOLDER_PATH_PREFIX, filePath);
      const jsonData = await fs.readFile(fullPath);
      return JSON.parse(jsonData.toString());
    } catch (error) {
      return null;
    }
  }
}

// Manipulate files in S3
class S3 {
  static client = new S3Client({
    region: AWS_S3_BUCKET_REGION,
    credentials: {
      accessKeyId: AWS_S3_ACCESS_KEY,
      secretAccessKey: AWS_S3_SECRET_KEY,
    },
  });

  static async saveObject(key: string, data: any): Promise<PutObjectOutput> {
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
      Body: data,
    });

    try {
      return await S3.client.send(command);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static getObjectUrl(key: string): string {
    return `${AWS_S3_BUCKET_URL}/${key}`;
  }

  static async listObjects(
    prefix: string = ""
  ): Promise<(string | undefined)[]> {
    const command = new ListObjectsCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Delimiter: "/",
      Prefix: prefix,
    });

    let response: ListObjectsOutput = await S3.client.send(command);

    if (response.CommonPrefixes) {
      return response.CommonPrefixes.map((obj) =>
        obj.Prefix?.replace(/(^.*?)\/(.*?)\//, "$2")
      );
    }

    return [];
  }

  static async getObject(key: string): Promise<JSON | null> {
    const command = new GetObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
    });

    try {
      const response = await S3.client.send(command);
      const str = await response.Body?.transformToString();
      return JSON.parse(str);
    } catch (error) {
      if (error.Code === "NoSuchKey") {
        return null;
      } else {
        console.error(error);
        throw error;
      }
    }
  }
}
