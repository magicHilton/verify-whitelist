// asdfasdfsd
import path from 'path'
import fs from 'fs'
import ethers from 'ethers'
import keccak256 from 'keccak256' // Keccak256 hashing
import MerkleTree from 'merkletreejs' // MerkleTree.js

const entryPath: string = path.join(__dirname, '../whitelist.json')

const outputPath: string = path.resolve(__dirname, '../Merkle.json')

import { logger } from './utils/logger'

function getTree(whitelist: string[]) {
  const leaves: Buffer[] = whitelist.map((i) => keccak256(i))
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
  const root = tree.getHexRoot()
  return {
    root,
  }
}

async function start() {
  if (!fs.existsSync(entryPath)) {
    logger.error('Missing config.json. Please add.')
    process.exit(1)
  }
  try {
    const dataBuffer: Buffer = await fs.readFileSync(entryPath)
    const whitelist: string[] = JSON.parse(dataBuffer.toString())
    const { root } = getTree(whitelist)
    await fs.writeFileSync(
      outputPath,
      JSON.stringify({
        root,
        whitelist,
      }),
    )
    logger.info('success')
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

start()
