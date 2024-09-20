import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "Singapore" using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySingapore: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the "Singapore" contract
  await deploy("Singapore", {
    from: deployer,
    // Assuming no constructor arguments for "Singapore" contract.
    args: [],
    log: true,
    autoMine: true, // Automatically mine the deployment on local networks.
  });

  // Fetch the deployed contract to interact with it
  const singaporeContract = await hre.ethers.getContract<Contract>("Singapore", deployer);
  console.log("Singapore contract deployed at:", singaporeContract.address);
};

export default deploySingapore;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Singapore
deploySingapore.tags = ["Singapore"];
