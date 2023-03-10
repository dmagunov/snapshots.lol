import type { NextApiRequest, NextApiResponse } from "next";
import type { Snapshot as SnapshotType } from "types";

import API from "lib/api";
import IPFS from "lib/ipfs";
import { toMetaFromSnapshot } from "lib/snapshot";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(500);
  }

  try {
    const snapshot: SnapshotType = JSON.parse(req.body);

    if (await API.getSnapshotMeta(snapshot.id)) {
      throw new Error("Snapshot already exists");
    }

    let snapshotStream = await API.getSnapshotScreenshot(snapshot.id);
    let screenshotIpfsHash = await IPFS.storeSnapshotScreensot(
      snapshot.id,
      snapshotStream
    );
    snapshot.image = IPFS.getFileUrl(screenshotIpfsHash);

    const snapshotMeta = await toMetaFromSnapshot(snapshot);
    let metaIpfsHash = await IPFS.storeSnapshotMeta(
      snapshot.id,
      JSON.parse(snapshotMeta)
    );

    await API.saveSnapshot(snapshot.id, JSON.stringify(snapshot));

    // NEXT: Clone screenshot and meta in the S3 bucket under ${hash}.png and ${hash}.json and update json to point to S3?
    return res.status(200).json({
      url: IPFS.getFileUrl(metaIpfsHash),
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
