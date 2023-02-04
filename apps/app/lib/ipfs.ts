import PinataSDK, { PinataPinResponse } from "@pinata/sdk";

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET!;

export default class IPFS {
  static async storeSnapshotScreensot(
    id: string,
    stream: ReadableStream<Uint8Array>
  ): Promise<string> {
    let response = await Pinata.storeSnapshotScreensot(id, stream);
    return response.IpfsHash;
  }

  static async storeSnapshotMeta(id: string, meta: JSON): Promise<string> {
    let response = await Pinata.storeSnapshotMeta(id, meta);
    return response.IpfsHash;
  }

  static getFileUrl(hash: string) {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
}

class Pinata {
  static client = new PinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

  static async storeSnapshotScreensot(
    id: string,
    stream: ReadableStream<Uint8Array>
  ): Promise<PinataPinResponse> {
    return await Pinata.client.pinFileToIPFS(stream, {
      pinataMetadata: { name: id },
    });
  }

  static async storeSnapshotMeta(
    id: string,
    meta: JSON
  ): Promise<PinataPinResponse> {
    return await Pinata.client.pinJSONToIPFS(meta, {
      pinataMetadata: { name: id },
    });
  }
}
