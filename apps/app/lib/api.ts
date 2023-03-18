import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsOutput,
  PutObjectOutput,
} from "@aws-sdk/client-s3";

const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY!;
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY!;
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL!;

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL!;

const CACHE_FOLDER = "cache";
const PREVIEW_FOLDER = "preview";
const META_FILE_NAME = "meta.json";
const SNAPSHOT_FILE_NAME = "snapshot.json";
const SCREENSHOT_FILE_NAME = "image.png";

export default class API {
  static takeSnapshotScreenshot(key: string, url: string): void {
    // do not wait for completion, just run
    fetch(SCREENSHOT_API_URL, {
      method: "POST",
      body: JSON.stringify({
        key,
        url,
      }),
    });
  }

  static createSnapshotScreenshot(
    snapshotId: string,
    snapshotUrl: string
  ): string {
    let key = `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`;
    API.takeSnapshotScreenshot(key, snapshotUrl);
    return S3.getObjectUrl(key);
  }

  static getSnapshotScreenshotUrl(snapshotId: string): string {
    return S3.getObjectUrl(
      `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`
    );
  }

  static async getSnapshotScreenshot(
    snapshotId: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    let url = S3.getObjectUrl(
      `${PREVIEW_FOLDER}/${snapshotId}/${SCREENSHOT_FILE_NAME}`
    );

    let response = await fetch(url);
    return response.body;
  }

  static async saveSnapshotMeta(
    snapshotId: string,
    meta: string
  ): Promise<string> {
    let key = `${CACHE_FOLDER}/${snapshotId}/${META_FILE_NAME}`;
    await S3.saveObject(key, meta);
    return S3.getObjectUrl(key);
  }

  static async saveSnapshot(snapshotId: string, meta: string): Promise<string> {
    let key = `${PREVIEW_FOLDER}/${snapshotId}/${SNAPSHOT_FILE_NAME}`;
    await S3.saveObject(key, meta);
    return S3.getObjectUrl(key);
  }

  static async getSnapshots(): Promise<(string | undefined)[]> {
    return await S3.listObjects(`${CACHE_FOLDER}/`);
  }

  static async getSnapshotMeta(snapshotId: string): Promise<JSON> {
    return await S3.getObject(
      `${CACHE_FOLDER}/${snapshotId}/${META_FILE_NAME}`
    );
  }

  static async getSnapshot(snapshotId: string): Promise<JSON> {
    return await S3.getObject(
      `${PREVIEW_FOLDER}/${snapshotId}/${SNAPSHOT_FILE_NAME}`
    );
  }
}

// Manipulate objects in S3
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
