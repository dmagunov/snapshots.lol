import type { NextApiRequest, NextApiResponse } from "next";
import type { Snapshot as SnapshotType } from "types";

import Ajv from "ajv"

import API from "lib/api";
import { SNAPSHOT_JSON_SCHEMA } from "lib/snapshot";

const SNAPSHOT_PREVIEW_URL_PREFIX = process.env.SNAPSHOT_PREVIEW_URL_PREFIX;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "POST") {
    return res.status(500);
  }

  try {
    let snapshot: SnapshotType = JSON.parse(req.body);

    if (await API.getSnapshotMeta(snapshot.id)) {
      throw new Error("Snapshot already exists");
    }

    const ajv = new Ajv();
    const validate = ajv.compile(SNAPSHOT_JSON_SCHEMA);

    if (!validate(snapshot)) {
      throw new Error("Invalid snapshot");
    }

    await API.saveSnapshot(snapshot.id, JSON.stringify(snapshot));
    let screenshot = await API.createSnapshotScreenshot(snapshot.id, `${SNAPSHOT_PREVIEW_URL_PREFIX}/${snapshot.id}`);
    return res.status(200).json({ screenshot });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  } 
}
