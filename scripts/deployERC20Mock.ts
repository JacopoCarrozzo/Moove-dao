import { ethers } from "hardhat";
import { parseUnits } from "ethers"; 

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying ERC20Mock with the account: ${deployer.address}`);

  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  
  const token = await ERC20Mock.deploy("MyToken", "MTK", parseUnits("1000000", 18)); 

  await token.waitForDeployment();

  console.log(`ERC20Mock deployed to: ${token.target}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
