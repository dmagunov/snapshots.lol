import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  ListObjectsOutput,
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

const META_FILE_NAME = "meta.json";
const SNAPSHOT_FILE_NAME = "snapshot.json";
export const SCREENSHOT_FILE_NAME = "image.png";

// wrapper for api
// Do I need to use a static class here?

export default class API {
  static dev: boolean = process.env.NODE_ENV === "development";

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

    return API.dev
      ? await LocalFolder.saveSnapshotScreenshot(snapshotId, blob)
      : await S3.saveSnapshotScreensot(snapshotId, blob);
  }

  static async getSnapshotScreenshot(
    snapshotId: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    let url = API.dev
      ? await LocalFolder.getSnapshotScreenshotUrl(snapshotId)
      : await S3.getSnapshotScreenshotUrl(snapshotId);

    let response = await fetch(url);
    return response.body;
  }

  static async saveSnapshotMeta(
    snapshotId: string,
    meta: string
  ): Promise<string> {
    return API.dev
      ? await LocalFolder.saveSnapshotMeta(snapshotId, meta)
      : await S3.saveSnapshotMeta(snapshotId, meta);
  }

  static async saveSnapshot(snapshotId: string, meta: string): Promise<string> {
    return API.dev
      ? await LocalFolder.saveSnapshotMeta(snapshotId, meta, SNAPSHOT_FILE_NAME)
      : await S3.saveSnapshotMeta(snapshotId, meta, SNAPSHOT_FILE_NAME);
  }

  static async getSnapshots(): Promise<(string | undefined)[]> {
    return API.dev ? await LocalFolder.getSnapshots() : await S3.getSnapshots();
  }

  static async getSnapshotMeta(snapshotId: string): Promise<JSON> {
    return API.dev
      ? await LocalFolder.getSnapshotMeta(snapshotId)
      : await S3.getSnapshotMeta(snapshotId);
  }

  static async getSnapshot(snapshotId: string): Promise<JSON> {
    return API.dev
      ? await LocalFolder.getSnapshotMeta(snapshotId, SNAPSHOT_FILE_NAME)
      : await S3.getSnapshotMeta(snapshotId, SNAPSHOT_FILE_NAME);
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

  static async saveSnapshotMeta(
    snapshotId: string,
    meta: string,
    fileName: string = META_FILE_NAME
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${snapshotId}/${fileName}`,
      Body: meta,
    });

    await S3.client.send(command);
    return `${AWS_S3_BUCKET_URL}/${snapshotId}/${fileName}`;
  }

  static async saveSnapshotScreensot(
    snapshotId: string,
    blob: Blob
  ): Promise<string> {
    let data = await blob.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${snapshotId}/${SCREENSHOT_FILE_NAME}`,
      Body: arrayBufferToBuffer(data),
    });

    try {
      await S3.client.send(command);
      return `${AWS_S3_BUCKET_URL}/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static getSnapshotScreenshotUrl(snapshotId: string): string {
    return `${AWS_S3_BUCKET_URL}/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
  }

  static async getSnapshots(): Promise<(string | undefined)[]> {
    const command = new ListObjectsCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Delimiter: "/",
      Prefix: "",
    });

    let response: ListObjectsOutput = await S3.client.send(command);

    if (response.CommonPrefixes) {
      return response.CommonPrefixes.map((obj) => obj.Prefix?.replace("/", ""));
    }

    return [];
  }

  static async getSnapshotMeta(
    snapshotId: string,
    fileName: string = META_FILE_NAME
  ): Promise<JSON | null> {
    const fileUrl = `${AWS_S3_BUCKET_URL}/${snapshotId}/${fileName}`;
    try {
      const response = await fetch(fileUrl);

      if (response.status === 404) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
