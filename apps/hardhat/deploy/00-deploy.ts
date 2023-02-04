import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const DEVELOPMENT_CHAINS = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

const deploy: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const waitBlockConfirmations = DEVELOPMENT_CHAINS.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  const args: any[] = [];
  const TheNFTSnapshot = await deploy("TheNFTSnapshot", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations || 1,
  });

  await hre.addressExporter.save({
    TheNFTSnapshot: TheNFTSnapshot.address,
  });
};

export default deploy;
deploy.tags = ["all"];
