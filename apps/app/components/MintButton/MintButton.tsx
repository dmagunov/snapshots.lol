import {
  useAccount,
  useConnect,
  useBalance,
  useNetwork,
  useDisconnect,
  useSwitchNetwork,
} from "wagmi";
import { useEffect } from "react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { defaultChain } from "lib/wagmiClient";
import { MintButton, Address, Label } from "./MintButton.styles";

type MintButtonComponentrops = {
  onClick: () => void;
  disabled?: boolean;
};

export default function MintButtonComponent({
  onClick,
  disabled,
  ...props
}: MintButtonComponentrops) {
  const { address, isConnected, isConnecting } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  const { connect } = useConnect({
    connector: new MetaMaskConnector({
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  });

  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork({
    onError() {
      disconnect();
    },
  });

  useEffect(() => {
    if (chain?.unsupported) {
      switchNetwork?.(defaultChain.id);
    }
  }, [chain]);

  return (
    <MintButton
      style={{ fontSize: isConnected ? "3rem" : "2.5rem" }}
      color={isConnected ? "red" : "blue"}
      disabled={disabled || isConnecting}
      onClick={() => (isConnected ? onClick() : connect())}
      {...props}
    >
      {isConnected && (
        <div>
          Mint
          <Label>Connected to:</Label>
          <Address title={`Balance: ${balance?.formatted} ${balance?.symbol}`}>
            {address?.slice(0, 6)}...
            {address?.slice(address?.length - 4)}
          </Address>
        </div>
      )}
      {!address && "Connect Wallet"}
    </MintButton>
  );
}
