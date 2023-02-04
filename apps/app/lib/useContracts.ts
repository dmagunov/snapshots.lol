import { useState, useEffect } from "react";
import { HardhatExportContracts } from "types/hardhat";
import { useNetwork } from "wagmi";
import { ContractAddresses } from "@thenftsnapshot/hardhat/addresses/addresses";

export default function useContracts() {
  const { chain } = useNetwork();
  const [contracts, setContracts] = useState<HardhatExportContracts>();

  useEffect(() => {
    if (!chain) {
      return;
    }

    const contracts = ContractAddresses[chain.id];
    setContracts(contracts);
  }, [chain]);

  return {
    contracts,
  };
}
