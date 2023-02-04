import { Chain, configureChains, createClient } from "wagmi";
import * as allChains from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const DEFAULT_CHAIN = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN!, 10);
const SUPPORTED_CHAINS = JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_CHAINS!);
const RPCS = {
  1: process.env.NEXT_PUBLIC_RPC_1!,
  5: process.env.NEXT_PUBLIC_RPC_5!,
  31337: process.env.NEXT_PUBLIC_RPC_31337!,
};

export const getEtherScanTxUrl = (chainId: number, txHash: string): string => {
  const urls = {
    1: "https://etherscan.io",
    5: "https://goerli.etherscan.io",
  };
  let url = urls[chainId] ?? urls[1];
  return `${url}/tx/${txHash}`;
};

export const defaultChain: Chain | undefined = Object.values(allChains).find(
  (chain) => DEFAULT_CHAIN === chain?.id
);

const supportedChains: Chain[] = Object.values(allChains).filter(
  (chain) => chain.id && SUPPORTED_CHAINS.includes(chain.id)
);

const getRpcUrl = (chainId: number): string => {
  return RPCS[chainId];
};

export const {
  chains: [, ...chains],
  provider,
} = configureChains<any>(
  Array.from(new Set([defaultChain, ...supportedChains])).filter(
    Boolean
  ) as Chain[],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const rpcUrl = getRpcUrl(chain.id);
        if (!rpcUrl) {
          throw new Error(`No RPC provided for chain ${chain.id}`);
        }
        return { http: rpcUrl };
      },
    }),
    publicProvider(),
  ]
);

export const wagmiClient: any = createClient({
  autoConnect: true,
  provider,
});
