import { Chain } from '@thirdweb-dev/chains'

// your token bound factory address
export const tokenBoundRegistry: string = '0xbf29146F8bC461d101D9Aa755cb84EfCF527Bd9d'
export const tokenBoundAccount: string = '0x62581d3D1bE9594450c9a7CEaB12E6d92a1dd47e'

export const vAstrContract: string = "0xe84Aa76A6600FB0D45B6e1761798dD74900cCF06";  // For test
export const nftDropContract: string = "0x9927E162D13199FCE7Edf81210e4aD5304b97185";

export const vaultWallet: string = '0x43B0F187C4882AB02cCE3Bf8f65B7E81687d6E3F';

// Your thirdweb api key - you can get one at https://thirdweb.com/dashboard/api-keys
export const TWApiKey: string = 'dc9b34e3583aa2ba312fe2b3024cc3fe'
// 

export const activeChain = {
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

  // export const activeChain = {
  //   "chain": "ETH",
  //   "chainId": 3776,
  //   "explorers": [
  //     {
  //       "name": "Blockscout Astar zkEVM explorer",
  //       "url": "https://astar-zkevm.explorer.startale.com",
  //       "standard": "EIP3091"
  //     }
  //   ],
  //   "faucets": [],
  //   "features": [],
  //   "icon": {
  //     "url": "ipfs://QmRySLe3su59dE5x5JPm2b1GeZfz6DR9qUzcbp3rt4SD3A",
  //     "width": 300,
  //     "height": 300,
  //     "format": "png"
  //   },
  //   "infoURL": "https://astar.network",
  //   "name": "Astar zkEVM",
  //   "nativeCurrency": {
  //     "name": "Ether",
  //     "symbol": "ETH",
  //     "decimals": 18
  //   },
  //   "networkId": 3776,
  //   "parent": {
  //     "type": "L2",
  //     "chain": "eip155-1",
  //     "bridges": [
  //       {
  //         "url": "https://bridge.gelato.network/bridge/astar-zkevm"
  //       }
  //     ]
  //   },
  //   "redFlags": [],
  //   "rpc": [
  //     "https://3776.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
  //     "https://rpc.startale.com/astar-zkevm"
  //   ],
  //   "shortName": "astarzk",
  //   "slug": "astar-zkevm",
  //   "testnet": false,
  //   "title": "Astar zkEVM Mainnet"
  // } as const satisfies Chain;

export const nftDropAddress: string = '0x9927E162D13199FCE7Edf81210e4aD5304b97185'
export const tokenAddress: string = '0xe84Aa76A6600FB0D45B6e1761798dD74900cCF06'

export const registryAddress: string = '0xbf29146F8bC461d101D9Aa755cb84EfCF527Bd9d'
