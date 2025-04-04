import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const ERC20MockAddress = "0x828dC6EabBDC2977b74669fa99d146F3c8B74D79"; 

  const MooveDAO = await ethers.getContractFactory("MooveDAO");

  const mooveDAO = await MooveDAO.deploy(ERC20MockAddress);

  const deployedContract = await mooveDAO.waitForDeployment();

  console.log(`MooveDAO deployed to: ${deployedContract.target}`);
 }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
