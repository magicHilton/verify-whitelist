import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
dotenv.config()

// const { ADDRESS } = process.env

async function main() {
  const GoodStone = await ethers.getContractFactory('GoodStone')
  // const [owner, other] = await ethers.getSigners()
  // console.log(owner.address, '98')

  const goodStone = await GoodStone.deploy()

  await goodStone.deployed()

  console.log('success address is ', goodStone.address) // 0xe2a32ad43fA4283650C9B2C47CA10619EB3f63Fe
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

// const gas = 2100000
// const gasPrice = await owner
//   .getGasPrice()
//   .then((r) => ethers.utils.formatUnits(r, 18))

// const balance = await owner
//   .getBalance()
//   .then((r) => ethers.utils.formatEther(r))

// gas * price + value

// console.log(gasPrice, '111')
// console.log(balance, '111')
