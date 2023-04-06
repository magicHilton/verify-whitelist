import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { getAddress } from 'ethers/lib/utils'
import { getMerkleData, getmerkleTree } from '../utils/verify'

async function deploy() {
  const _GoodStone = await ethers.getContractFactory('GoodStone')
  const GoodStone = await _GoodStone.deploy()
  const [owner] = await ethers.getSigners()
  return {
    GoodStone,
    owner,
  }
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
      const merkletree = await getmerkleTree()
      await GoodStone.setRoot(merkletree.root)
      expect(await GoodStone.getRoot()).to.equal(merkletree.root)
    })
  })

  describe('preSaleMint', async function () {
    it('preSaleMint', async function () {
      const { GoodStone, owner } = await loadFixture(deploy)
      const { root, getProof } = await getmerkleTree()
      // console.log(verify(owner.address), 'verify')
      await GoodStone.flipSaleActive()
      await GoodStone.setRoot(root) // mock frontend

      // const data = await getMerkleData()
      // await GoodStone.setRoot(data.root) // mock frontend

      const mintPrice = await GoodStone.mintPrice()

      const balanceOf = await GoodStone.balanceOf(owner.address)

      await GoodStone.preSaleMint(1, getProof(owner.address), {
        value: mintPrice,
      })
      const currentBalanceOf = await GoodStone.balanceOf(
        getAddress(owner.address),
      )
      expect(balanceOf.toNumber()).to.equal(currentBalanceOf.toNumber() - 1)
    })
  })
})
