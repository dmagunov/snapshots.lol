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

const { join } = path;

const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY!;
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY!;
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL!;

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL!;
const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST!;

const CACHE_FOLDER = "cache";
const PREVIEW_FOLDER = "preview";
const META_FILE_NAME = "meta.json";
const SNAPSHOT_FILE_NAME = "snapshot.json";
const SCREENSHOT_FILE_NAME = "image.png";

export default class API {
  // static dev: boolean = process.env.NODE_ENV === "development";
  static dev: boolean = false;

  static async takeSnapshotScreenshot(url: string): Promise<Blob> {
    let response = await fetch(SCREENSHOT_API_URL, {
      method: "POST",
      body: JSON.stringify({
        url,
      }),
    });

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
      return await LocalFolder.saveSnapshotScreenshot(snapshotId, blob);
    }

    let data = await blob.arrayBuffer();
    let key = `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
    await S3.saveObject(key, arrayBufferToBuffer(data));
    return S3.getObjectUrl(key);
  }

  static getSnapshotScreenshotUrl(snapshotId: string): string {
    return API.dev
      ? LocalFolder.getSnapshotScreenshotUrl(snapshotId)
      : S3.getObjectUrl(
          `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`
        );
  }

  static async getSnapshotScreenshot(
    snapshotId: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    let url = API.dev
      ? LocalFolder.getSnapshotScreenshotUrl(snapshotId)
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
      return await LocalFolder.saveSnapshotMeta(snapshotId, meta);
    }
    let key = `${CACHE_FOLDER}/${snapshotId}/${META_FILE_NAME}`;
    await S3.saveObject(key, meta);
    return S3.getObjectUrl(key);
  }

  static async saveSnapshot(snapshotId: string, meta: string): Promise<string> {
    if (API.dev) {
      return await LocalFolder.saveSnapshotMeta(
        snapshotId,
        meta,
        SNAPSHOT_FILE_NAME
      );
    }

    let key = `${PREVIEW_FOLDER}/${snapshotId}/${SNAPSHOT_FILE_NAME}`;
    await S3.saveObject(key, meta);
    return S3.getObjectUrl(key);
  }

  static async getSnapshots(): Promise<(string | undefined)[]> {
    return API.dev
      ? await LocalFolder.getSnapshots()
      : await S3.listObjects(`${CACHE_FOLDER}/`);
  }

  static async getSnapshotMeta(snapshotId: string): Promise<JSON> {
    return API.dev
      ? await LocalFolder.getSnapshotMeta(snapshotId)
      : await S3.getObject(`${CACHE_FOLDER}/${snapshotId}/${META_FILE_NAME}`);
  }

  static async getSnapshot(snapshotId: string): Promise<JSON> {
    return API.dev
      ? await LocalFolder.getSnapshotMeta(snapshotId, SNAPSHOT_FILE_NAME)
      : await S3.getObject(
          `${PREVIEW_FOLDER}/${snapshotId}/${SNAPSHOT_FILE_NAME}`
        );
  }
}

class LocalFolder {
  static pathPrefix = "/public/snapshots";

  static async saveSnapshotScreenshot(
    snapshotId: string,
    blob: Blob
  ): Promise<string> {
    const filePath = path.join(
      process.cwd(),
      LocalFolder.pathPrefix,
      `/${snapshotId}/${SCREENSHOT_FILE_NAME}`
    );
    const buffer = await blobToBuffer(blob);
    if (!fsSync.existsSync(path.dirname(filePath))) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }
    await fs.writeFile(filePath, buffer);

    return `http://${NEXT_PUBLIC_HOST}/snapshots/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
  }

  static getSnapshotScreenshotUrl(snapshotId: string): string {
    return `http://${NEXT_PUBLIC_HOST}/snapshots/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
  }

  static async saveSnapshotMeta(
    snapshotId: string,
    meta: string,
    fileName: string = META_FILE_NAME
  ): Promise<string> {
    const filePath = path.join(
      process.cwd(),
      LocalFolder.pathPrefix,
      `/${snapshotId}/${fileName}`
    );
    if (!fsSync.existsSync(path.dirname(filePath))) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }
    await fs.writeFile(filePath, meta, "utf8");

    return `http://${NEXT_PUBLIC_HOST}/snapshots/${snapshotId}/${fileName}`;
  }

  static async getSnapshots(): Promise<(string | undefined)[]> {
    const snapshotsPath: string = join(process.cwd(), LocalFolder.pathPrefix);

    let snapshotsFolders = await fs.readdir(snapshotsPath);

    return snapshotsFolders.filter((snapshot) =>
      fsSync.existsSync(`${snapshotsPath}/${snapshot}/${META_FILE_NAME}`)
    );
  }

  static async getSnapshotMeta(
    snapshotId: string,
    fileName: string = META_FILE_NAME
  ): Promise<JSON | null> {
    try {
      const filePath = path.join(
        process.cwd(),
        LocalFolder.pathPrefix,
        `${snapshotId}/${fileName}`
      );
      const jsonData = await fs.readFile(filePath);
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
