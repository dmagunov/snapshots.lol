import * as Y from "yjs";
import { bufferToBase64 } from "../lib/utils";
import { META_SAMPLE } from "../lib/snapshot";

const META_SAMPLE_EXCLUDED_PROPS = ["id", "external_url", "image", "version"];

function omit(obj, excludedProps) {
  const newObj = {};
  for (let prop in obj) {
    if (!excludedProps.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

function createSnapshotTemplate(meta) {
  const ydoc = new Y.Doc();
  ydoc
    .getText()
    .insert(0, JSON.stringify(meta, null, 2).replace(/\n/g, "\r\n"));
  const template = Y.encodeStateAsUpdate(ydoc);
  return bufferToBase64(template);
}

console.log(
  createSnapshotTemplate(omit(META_SAMPLE, META_SAMPLE_EXCLUDED_PROPS))
);
