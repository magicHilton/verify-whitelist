import { getContract, getProvider } from '@wagmi/core'

const { GOODSTONE } = process.env

import abi from './abi.json'
import { BigNumber } from 'ethers'

async function getNftInfo(address: string) {
  const provider = getProvider()
  const contractWithProvider = getContract({
    address,
    abi,
    signerOrProvider: provider,
  })

  console.log(contractWithProvider, 'contractWithProvider')
  const name: string = await contractWithProvider.name()
  const isSaleActive: boolean = await contractWithProvider._isSaleActive()
  const maxSupply: number = await contractWithProvider
    .MAX_SUPPLY()
    .then((i: BigNumber) => i.toNumber())

  const mintPrice: number = await contractWithProvider
    .mintPrice()
    .then((r: BigNumber) => r.toNumber())

  const totalSupply: number = await contractWithProvider
    .totalSupply()
    .then((r: BigNumber) => r.toNumber())

  return {
    name,
    isSaleActive,
    maxSupply,
    mintPrice,
    totalSupply,
  }
}

export interface INFT {
  name: string
  isSaleActive: boolean
  maxSupply: number
  mintPrice: number
  totalSupply: number
}

const contractAddressWidthABI = {
  abi,
  address: GOODSTONE as string,
}
export { getNftInfo, GOODSTONE, contractAddressWidthABI }
