import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const SCREENSHOT_WIDTH = 1600;
const SCREENSHOT_HEIGHT = 1200;
const ALLOWED_HOST = process.env.ALLOWED_HOST || "thenftsnapshot";
const WAIT_FOR_DOM_TIMEOUT_SEC = process.env.WAIT_FOR_DOM_TIMEOUT_SEC || 30000;

const handler = async (event) => {
  let body = event.body ? JSON.parse(event.body) : event;
  let {
    url,
    width = SCREENSHOT_WIDTH,
    height = SCREENSHOT_HEIGHT,
    waitForDom,
  } = body;

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

  // NEXT: Find the way in dev mode to override the response headers
  return {
    headers: { "Content-Type": "image/png" },
    statusCode: 200,
    body: buffer.toString("base64"),
    isBase64Encoded: true,
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
