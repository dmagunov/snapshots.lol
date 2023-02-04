import "dotenv/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
// import "hardhat-gas-reporter";
import "hardhat-deploy";
import "hardhat-address-exporter";
import "solidity-coverage";
import { HardhatUserConfig } from "hardhat/config";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL!;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY!;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [METAMASK_PRIVATE_KEY],
      chainId: 5,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  addressExporter: {
    outDir: "./addresses",
    runPrettier: false,
  },
  // gasReporter: {
  //     enabled: true,
  //     currency: "USD",
  //     outputFile: "gas-report.txt",
  //     noColors: true,
  //     // coinmarketcap: COINMARKETCAP_API_KEY,
  // },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    },
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};

export default config;
