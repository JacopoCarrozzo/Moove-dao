# MooveDAO

MooveDAO is an Ethereum-based smart contract that implements a decentralized autonomous organization (DAO). Users can purchase shares in the DAO using ERC-20 tokens and participate in the decision-making process by voting on proposals.

## Technologies Used
- **Solidity**: Programming language for smart contracts on Ethereum.
- **Hardhat**: Development environment for testing and deploying smart contracts.
- **OpenZeppelin**: Library for secure and standardized contracts.
- **TypeScript**: For writing more robust and readable tests.
- **Chai**: Assertion library for testing.

## Main Features
### 1. Purchase of Shares
Users can purchase shares in the DAO using an ERC-20 token. The price per share is fixed and defined in the contract.

### 2. Creating Proposals
Only DAO members (those who own shares) can create proposals to improve the project.

### 3. Voting on Proposals
Members can vote on proposals based on the number of shares they own. They can also delegate voting to other members.

### 4. Executing Proposals
If a proposal receives more votes in favor than against, it is approved and executed.

### 5. Stopping the Sale
The contract owner can stop the sale of shares at any time.

## Installation
Make sure you have [Node.js](https://nodejs.org/) and [Hardhat](https://hardhat.org/) installed.

1. Clone the repository:
```bash
git clone [https://github.com/your-username/MooveDAO.git](https://github.com/JacopoCarrozzo/Moove-dao)
cd MooveDAO
```
2. Install the dependencies:
```bash
npm install
```

## Testing
To run the tests, use the command:
```bash
npx hardhat test
```

## Deployment
You can deploy the contract on an Ethereum blockchain or a testnet as follows:
```bash
npx hardhat run scripts/deploy.ts --network rinkeby
```
