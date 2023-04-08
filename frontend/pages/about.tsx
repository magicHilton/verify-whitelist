import type { NextPage } from 'next'
import { GOODSTONE } from '@/common/nft'
import useReadableContract from 'hooks/useReadableContract'
import { useAccount } from 'wagmi'

interface IProps {
  data: string
  contractAddress: string
}

const About: NextPage<IProps> = (props) => {
  const { contractAddress } = props
  const { address } = useAccount()
  console.log(address, 'address--->wallet')
  const { nftInfo } = useReadableContract(contractAddress)
  if (!nftInfo.name) return <div>loading ...</div>
  return (
    <div>
      <h2>this is about page</h2>
      <h3>ContractInfo-HL</h3>
      <h3>NFT NAME -- {nftInfo.name}</h3>
      <h3>NFT MINTPRICE -- {nftInfo.mintPrice}</h3>
      <h3>NFT TOTALSUPPLY -- {nftInfo.totalSupply}</h3>
      <h3>NFT MAXSUPPLY -- {nftInfo.maxSupply}</h3>
    </div>
  )
}

export async function getServerSideProps() {
  return { props: { data: 'hello', contractAddress: GOODSTONE } }
}

export default About
