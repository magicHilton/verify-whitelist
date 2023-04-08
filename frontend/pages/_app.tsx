import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ConnectWallectProvider from '../components/web3'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectWallectProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </ConnectWallectProvider>
  )
}

export default MyApp
