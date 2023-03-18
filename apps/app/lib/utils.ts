/* eslint-disable no-extend-native*/

declare global {
  interface Array<T> {
    findBy(k: string, v: string | number | boolean): Object | undefined;
    filterBy(k: string, v: string | number | boolean): Array<T>;
  }
}

Array.prototype.findBy = function (key, value) {
  return this && this.find((item) => item[key] === value);
};
Array.prototype.filterBy = function (key, value) {
  return this && this.filter((item) => item[key] === value);
};

const isUrl = (url: string) => {
  return /^(http|https|ipfs):\/\/[^ "]+$/.test(url);
};

const bufferToBase64 = (buf: Buffer | Uint8Array): string => {
  return Buffer.from(buf).toString("base64");
};

const base64ToBuffer = (base64: string): Uint8Array | Buffer => {
  return Buffer.from(base64, "base64");
};

const getObjectValue = (obj: object, path: string): any => {
  const keys = path.split(".");
  let value = obj;

  for (let key of keys) {
    if (value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
};

export { isUrl, bufferToBase64, base64ToBuffer, getObjectValue };
