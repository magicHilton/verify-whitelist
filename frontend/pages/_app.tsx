import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ConnectWallectProvider from '../components/web3'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectWallectProvider>
      <Component {...pageProps} />
    </ConnectWallectProvider>
  )
}

export default MyApp
