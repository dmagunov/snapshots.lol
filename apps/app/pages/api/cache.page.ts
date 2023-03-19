import type { NextApiRequest, NextApiResponse } from "next";
import type { Snapshot as SnapshotType } from "types";

import { provider } from "lib/wagmiClient";
import Ajv from "ajv";

import API from "lib/api";
import { META_JSON_SCHEMA, toMetaFromSnapshot } from "lib/snapshot";
import { TheNFTSnapshot__factory } from "@thenftsnapshot/hardhat/typechain";
import { ContractAddresses } from "@thenftsnapshot/hardhat/addresses/addresses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(500);
  }

  try {
    const { snapshotId, chainId }: { snapshotId: string; chainId: number } =
      JSON.parse(req.body);

    if (await API.getSnapshotMeta(snapshotId)) {
      throw new Error("Snapshot already exists");
    }

    const contracts = ContractAddresses[chainId];
    const contract = TheNFTSnapshot__factory.connect(
      contracts.TheNFTSnapshot,
      provider({ chainId })
    );

    const snapshotMetaUrl: string = await contract.getTokenURI(snapshotId);

    if (!snapshotMetaUrl) {
      throw new Error("Snapshot not found");
    }

    // Pinata public gateway is not reliable, temporary using preview metadata from S3
    let snapshot = (await API.getSnapshot(
      snapshotId
    )) as unknown as SnapshotType;
    let snapshotMeta = await toMetaFromSnapshot(snapshot);

    const ajv = new Ajv({ strict: false });
    const validate = ajv.compile(META_JSON_SCHEMA);

    if (!validate(JSON.parse(snapshotMeta))) {
      throw new Error("Invalid meta");
    }

    await API.saveSnapshotMeta(snapshotId, snapshotMeta);

    await res.revalidate(`/${snapshotId}`);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
