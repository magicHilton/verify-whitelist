import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import fs from 'fs'
import path from 'path'
import keccak256 from 'keccak256'
import MerkleTree from 'merkletreejs'
import { getAddress } from 'ethers/lib/utils'

const merklePath = path.resolve(__dirname, '../Merkle.json')

interface IMerkleInfo {
  root: string
  tree: any
  whitelist: string[]
}

async function deploy() {
  const _GoodStone = await ethers.getContractFactory('GoodStone')
  const GoodStone = await _GoodStone.deploy()
  const [owner] = await ethers.getSigners()
  return {
    GoodStone,
    owner,
  }
}

async function getMerkleData() {
  const _merkletree = await fs.readFileSync(merklePath)
  const merkletree: IMerkleInfo = JSON.parse(_merkletree.toString())
  return {
    ...merkletree,
  }
}

async function createProof(a: string): Promise<string[]> {
  const { whitelist } = await getMerkleData()
  const merkleTree = new MerkleTree(whitelist, keccak256, {
    sortPairs: true,
  })
  const proof: string[] = merkleTree.getHexProof(a)
  return proof
}

describe('GoodStone', async function () {
  console.log('start test goodStone.sol')
  it('Should set the right owner', async function () {
    const { GoodStone, owner } = await loadFixture(deploy)
    expect(await GoodStone.owner()).to.equal(owner.address)
  })
  describe('deploy GoodStone', async function () {
    it('root', async function () {
      const { GoodStone } = await loadFixture(deploy)
      const merkletree = await getMerkleData()
      console.log(merkletree.root, 'root - static')
      await GoodStone.setRoot(merkletree.root)
      expect(await GoodStone.getRoot()).to.equal(merkletree.root)
    })
  })

  describe('preSaleMint', async function () {
    it('preSaleMint', async function () {
      const { GoodStone, owner } = await loadFixture(deploy)
      const merkletree = await getMerkleData()
      await GoodStone.setRoot(merkletree.root)

      console.log(owner.address, ' address->') // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
      const proof: string[] = await createProof(owner.address)
      const mintPrice = await GoodStone.mintPrice()
      console.log(proof, 'proof')
      console.log(mintPrice.toNumber(), 'price')

      const balanceOf = await GoodStone.balanceOf(owner.address)

      await GoodStone.preSaleMint(
        1,
        [
          '0x6f4e9783e4127f70224aeee5ca63c5a42f312237',
          '0xa4c8c642303530a278e8d9995b57d3cef220a8130341328b557530b66f4f42f3',
        ],
        {
          value: mintPrice,
        },
      )

      const currentBalanceOf = await GoodStone.balanceOf(
        getAddress(owner.address),
      )

      expect(balanceOf.toNumber()).to.equal(currentBalanceOf.toNumber() - 1)
    })
  })
})
