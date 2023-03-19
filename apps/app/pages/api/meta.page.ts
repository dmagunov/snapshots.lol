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

    // Update preview json with latest screenshot
    await API.saveSnapshot(snapshot.id, JSON.stringify(snapshot));

    let snapshotStream = await API.getSnapshotScreenshot(snapshot.image);
    let screenshotIpfsHash = await IPFS.storeSnapshotScreensot(
      snapshot.id,
      snapshotStream
    );

    // overwrite snapshot image with ones stored on IPFS
    snapshot.image = IPFS.getFileUrl(screenshotIpfsHash);

    const snapshotMeta = await toMetaFromSnapshot(snapshot);
    let metaIpfsHash = await IPFS.storeSnapshotMeta(
      snapshot.id,
      JSON.parse(snapshotMeta)
    );

    return res.status(200).json({
      url: IPFS.getFileUrl(metaIpfsHash),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
