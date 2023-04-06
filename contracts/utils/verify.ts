import fs from 'fs'
import path from 'path'
import { ethers } from 'hardhat'
import keccak256 from 'keccak256'
import MerkleTree from 'merkletreejs'

interface IMerkleData {
  whitelist: string[]
  root: string
}

const merklePath = path.join(__dirname, '../Merkle.json')

export async function getMerkleData(): Promise<IMerkleData> {
  const merkleBuffer = await fs.readFileSync(merklePath)
  return JSON.parse(merkleBuffer.toString())
}

export async function _getmerkleTree(whitelist: string[]) {
  function getLeave(a: string): string {
    return ethers.utils.keccak256(a)
  }
  const leaves = whitelist.map((i) => getLeave(i))
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
  const getProof = (address: string) => tree.getHexProof(getLeave(address))
  const root = tree.getHexRoot()
  return {
    root,
    getLeave,
    getProof,
    verify: (address: string) =>
      tree.verify(getProof(address), getLeave(address), root),
  }
}

export async function getmerkleTree() {
  const { whitelist } = await getMerkleData()
  return _getmerkleTree(whitelist)
}
