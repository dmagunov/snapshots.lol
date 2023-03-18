import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const SCREENSHOT_WIDTH = 1600;
const SCREENSHOT_HEIGHT = 1200;
const ALLOWED_HOST = process.env.ALLOWED_HOST || "thenftsnapshot";
const WAIT_FOR_DOM_TIMEOUT_SEC =
  parseInt(process.env.WAIT_FOR_DOM_TIMEOUT_SEC, 10) || 30000;

const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY;
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const handler = async (event) => {
  let body = event.body ? JSON.parse(event.body) : event;
  let {
    url,
    width = SCREENSHOT_WIDTH,
    height = SCREENSHOT_HEIGHT,
    waitForDom,
    key: s3ObjectKey,
  } = body;

  if (!s3ObjectKey) {
    throw new Error("Missing key");
  }

  try {
    url = new URL(body.url);
    console.log(`Check ${url} against allowed`);

    if (url.host.indexOf(ALLOWED_HOST) === -1) {
      throw new Error("Not allowed");
    }
  } catch (e) {
    return {
      statusCode: 403,
      body: "Forbidden",
    };
  }

  console.log(`Creating snapshot of ${url}`);
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width,
    height,
  });

  await page.goto(url.toString(), { waitUntil: "networkidle2" });

  if (waitForDom) {
    console.log(`Wait for DOM to settle`);
    try {
      await waitForDOMToSettle(page);
    } catch (e) {
      console.error(e);
    }
  }

  const buffer = await page.screenshot({
    type: "png",
    fullPage: true,
  });

  await page.close();
  await browser.close();

  const s3Client = new S3Client({
    region: AWS_S3_BUCKET_REGION,
    credentials: {
      accessKeyId: AWS_S3_ACCESS_KEY,
      secretAccessKey: AWS_S3_SECRET_KEY,
    },
  });

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: s3ObjectKey,
    Body: buffer,
    ContentType: "image/png",
  });

  await s3Client.send(command);

  return {
    headers: { "Content-Type": "application/json" },
    statusCode: 200,
    body: { success: true },
  };
};

// https://www.urlbox.io/puppeteer-wait-for-page-load
const waitForDOMToSettle = (
  page,
  timeoutMs = WAIT_FOR_DOM_TIMEOUT_SEC,
  debounceMs = 1000
) =>
  page.evaluate(
    (timeoutMs, debounceMs) => {
      let debounce = (func, ms = 1000) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            func.apply(this, args);
          }, ms);
        };
      };
      return new Promise((resolve, reject) => {
        let mainTimeout = setTimeout(() => {
          observer.disconnect();
          reject(new Error("Timed out whilst waiting for DOM to settle"));
        }, timeoutMs);

        let debouncedResolve = debounce(async () => {
          observer.disconnect();
          clearTimeout(mainTimeout);
          resolve();
        }, debounceMs);

        const observer = new MutationObserver(() => {
          debouncedResolve();
        });
        const config = {
          attributes: true,
          childList: true,
          subtree: true,
        };
        observer.observe(document.body, config);
      });
    },
    timeoutMs,
    debounceMs
  );

export { handler };
