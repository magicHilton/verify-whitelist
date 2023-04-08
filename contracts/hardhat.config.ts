import { HardhatUserConfig } from 'hardhat/config'
// import '@openzeppelin/hardhat-upgrades'
// import '@openzeppelin/contracts'clear
import * as dotenv from 'dotenv'
dotenv.config()
import '@nomiclabs/hardhat-ethers'

const { API_URL, PRIVATE_KEY, ETHERSCAN_GOERLI_KEY } = process.env

import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://localhost:8545',
    },
    sepolia: {
      // chainId: 11155111,
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      // gas: 2100000,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_GOERLI_KEY as string,
    },
  },
}

export default config
