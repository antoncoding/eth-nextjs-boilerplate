import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import {
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi';

import { goerli } from 'viem/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { Page } from '../components/Page'
import { theme } from '../styles/theme'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { injectedWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { publicProvider } from 'wagmi/providers/public'


import {config} from "dotenv"
config()

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY!;

const { chains, publicClient } = configureChains(
  [goerli],
  [
    alchemyProvider({apiKey: alchemyKey}),
    publicProvider(),
  ]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectorsForWallets([{
    groupName: 'Recommended',
    wallets: [metaMaskWallet({ chains, projectId: 'Lyra' }), injectedWallet({ chains })],
  }]),
  publicClient
})

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ChakraProvider>
        </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
