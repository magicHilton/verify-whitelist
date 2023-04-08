import type { NextPage } from 'next'

import { contractAddressWidthABI } from '@/common/nft'
import { ethers, BigNumber } from 'ethers'
import { toast } from 'react-toastify'

import {
  useAccount,
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useSigner,
} from 'wagmi'
import { useState } from 'react'

interface IProps {
  contractAddressWidthABI: {
    abi: any[]
    address: string
  }
}

const Mint: NextPage<IProps> = (props) => {
  const { contractAddressWidthABI } = props
  const { isConnected } = useAccount()
  const { data: singer } = useSigner()

  const [loading, setLoading] = useState(false)

  if (!isConnected) {
    return <div>Please connect your wallect first !!!</div>
  }

  const handlPublicMint = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const contractInstance = new ethers.Contract(
          contractAddressWidthABI.address,
          contractAddressWidthABI.abi,
          singer as any,
        )

        const mintPrice = await contractInstance.mintPrice()

        const translaction = await contractInstance.publicMint(1, {
          value: mintPrice,
        })

        await translaction.wait()
        resolve(true)
      } catch (error) {
        reject()
      }
    })
  }

  return (
    <div>
      <h2>this is Mint page</h2>

      <section>
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            toast.promise(
              handlPublicMint,
              {
                pending: 'publicMint transaction pending...',
                success: {
                  render: () => {
                    setLoading(false)

                    return 'This transaction successful'
                  },
                },
                error: {
                  render: () => {
                    setLoading(false)

                    return 'This transaction send failed'
                  },
                },
              },
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
              },
            )
          }}
        >
          publicMint
        </button>
      </section>
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      contractAddressWidthABI,
    },
  }
}

export default Mint
