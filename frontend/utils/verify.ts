import ethers, { keccak256 } from 'ethers'

import MerkleTree from 'merkletreejs'

import merkleData from './Merkle.json'

export function getMerkleData(): string[] {
  return merkleData.whitelist
}

export async function _getmerkleTree(whitelist: string[]) {
  function getLeave(a: string): string {
    return ethers.keccak256(a)
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

export type IMerkleData = typeof _getmerkleTree

export async function getmerkleTree() {
  const data = await _getmerkleTree(getMerkleData())
  return data
}
