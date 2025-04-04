import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat"; 
import "@typechain/ethers-v6"; 
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20", 
  typechain: {
    outDir: "typechain-types",  
    target: "ethers-v6",        
  },
  paths: {
    sources: "./contracts",  
    tests: "./test",        
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {},
    sepolia: {  
      url: process.env.SEPOLIA_RPC_URL || "",  
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],  
    },
  },
};

export default config;
