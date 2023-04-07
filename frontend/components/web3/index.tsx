import '@rainbow-me/rainbowkit/styles.css'
import {
  ConnectButton,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import CommonLayout from '../layout/indexa'

const alchemyId = process.env.ALCHEMY_ID as string

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [alchemyProvider({ apiKey: alchemyId }), publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'hilton app',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const ConnectWallectProvider: React.FC<any> = (props) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        // theme={darkTheme()}
        chains={chains}
      >
        <CommonLayout>{props.children}</CommonLayout>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ConnectWallectProvider
