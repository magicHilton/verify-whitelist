// asdfasdfsd
import path from 'path'
import fs from 'fs'
import { getAddress } from 'ethers'
import keccak256 from 'keccak256' // Keccak256 hashing
import MerkleTree from 'merkletreejs' // MerkleTree.js

const entryPath: string = path.join(__dirname, '../whitelist.json')

const outputPath: string = path.resolve(__dirname, '../Merkle.json')

import { logger } from './utils/logger'

async function generate(leaves: string[]) {
  logger.info('Generating Merkle tree.')
  logger.info(leaves)
  const merkleTree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  })

  const root: string = merkleTree.getHexRoot() // 0x3b8730dcb1d47f6c318a50bd90f99055ad75ae088a1d6b720993c169ff1eb318
  console.log(root, 'root')
  const proof = merkleTree.getHexProof(leaves[0])
  console.log(proof, merkleTree.verify(proof, leaves[0], root))

  await fs.writeFileSync(
    outputPath,
    JSON.stringify({
      root,
      tree: merkleTree,
      whitelist: leaves,
    }),
  )
  logger.info('Generated merkle tree and root saved to Merkle.json.')
}

async function start() {
  if (!fs.existsSync(entryPath)) {
    logger.error('Missing config.json. Please add.')
    process.exit(1)
  }

  const dataBuffer: Buffer = await fs.readFileSync(entryPath)
  const _data: string[] = JSON.parse(dataBuffer.toString()).map((i: string) =>
    getAddress(i),
  )
  await generate(_data)
}

start()
