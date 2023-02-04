import type { Snapshot as SnapshotType } from "types";
import type { ContractReceipt } from "@ethersproject/contracts";

import { useEffect } from "react";
import { useSigner, useNetwork } from "wagmi";
import { TheNFTSnapshot__factory } from "@thenftsnapshot/hardhat/typechain";

import useContracts from "lib/useContracts";

const API_CACHE_URL = "/api/cache";
const NEXT_PUBLIC_TX_WAIT_CONFIRMATIONS = parseInt(process.env.NEXT_PUBLIC_TX_WAIT_CONFIRMATIONS!, 10);

type MintSnapshotContractComponentProps = {
  snapshot: SnapshotType;
  children: React.ReactNode;
  metaUrl: string;
  onConfirm: () => void;
  onError: (error) => void;
  onSuccess: (receipt: ContractReceipt) => void;
};

export default function MintSnapshotContractComponent({
  snapshot,
  metaUrl,
  children,
  onConfirm,
  onSuccess,
  onError,
}: MintSnapshotContractComponentProps) {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { contracts } = useContracts();

  useEffect(() => {
    if (signer && contracts) {
      mint();
    }
  }, [signer, contracts]);

  const mint = async () => {
    const contract = TheNFTSnapshot__factory.connect(
      contracts.TheNFTSnapshot,
      signer
    );

    try {
      const tsx = await contract.safeMint(
        signer.getAddress(),
        snapshot.id,
        metaUrl
      );
      
      onConfirm();
      const receipt = await tsx.wait(NEXT_PUBLIC_TX_WAIT_CONFIRMATIONS);
      
      let cacheResponse = await fetch(API_CACHE_URL, {
        method: "POST",
        body: JSON.stringify({ snapshotId: snapshot.id, chainId: chain.id }),
      });

      if (!cacheResponse.ok) {
        // NEXT: Need to put it into the cron job
        console.error("Failed to cache snapshot");
      }

      onSuccess(receipt);

    } catch (error) {
      onError(error)
      console.error(error);
    } 
  };

  if (!signer) return null;

  return <>{children}</>;
}
