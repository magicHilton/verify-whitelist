import { INFT, getNftInfo } from '@/common/nft'
import { useState, useCallback, useEffect } from 'react'

const useReadableContract = (contractAddress: string) => {
  const [nftInfo, setInfo] = useState<INFT>({} as INFT)

  const init = useCallback(async (address: string) => {
    const info = await getNftInfo(address)
    setInfo(info)
  }, [])

  useEffect(() => {
    if (contractAddress) {
      init(contractAddress)
    }
  }, [init, contractAddress])

  return {
    nftInfo,
  }
}

export default useReadableContract
