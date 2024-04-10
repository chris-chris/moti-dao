import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles/globals.css";
import { Chain } from '@thirdweb-dev/chains'

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = {
  "chain": "ETH",
  "chainId": 6038361,
  "explorers": [
    {
      "name": "Blockscout zKyoto explorer",
      "url": "https://astar-zkyoto.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "Astar zkEVM Testnet zKyoto",
      "url": "https://zkyoto.explorer.startale.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRySLe3su59dE5x5JPm2b1GeZfz6DR9qUzcbp3rt4SD3A",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://astar.network",
  "name": "Astar zKyoto",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 6038361,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://6038361.rpc.thirdweb.com/dc9b34e3583aa2ba312fe2b3024cc3fe",
    // "https://rpc.startale.com/zkyoto",
    // "https://rpc.zkyoto.gelato.digital"
  ],
  "shortName": "azkyt",
  "slug": "astar-zkyoto",
  "testnet": true,
  "title": "Astar zkEVM Testnet zKyoto"
} as const satisfies Chain;

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.REACT_APP_TEMPLATE_CLIENT_ID}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
