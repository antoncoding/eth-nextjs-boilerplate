import { useState, useEffect } from 'react'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import {
  RainbowKitProvider, Theme, lightTheme
} from '@rainbow-me/rainbowkit';

import {
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi';

import { sepolia, goerli, mainnet } from 'viem/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { Page } from '../components/Page'
import { theme } from '../styles/theme'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import { publicProvider } from 'wagmi/providers/public'
import merge from 'lodash.merge';


import {config} from "dotenv"
config()

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY!;

const { chains, publicClient } = configureChains(
  [sepolia, goerli, mainnet],
  [
    alchemyProvider({apiKey: alchemyKey}),
    publicProvider()
  ]
);

const myTheme = merge(lightTheme(), {
  colors: {
    accentColor: '#56C3A9E6',
  },
  radii: {
    connectButton: '0.3rem',
    modal: '0.5rem',
  },
  fonts: {
    body: 'Inter, sans-serif'
  }
} as Theme);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectorsForWallets([{
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
    ]
  }]),
  publicClient
})

function MyApp({ Component, pageProps }: AppProps) {

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else return (<WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={myTheme}>
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
