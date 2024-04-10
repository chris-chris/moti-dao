import { ThirdwebNftMedia, useAddress, useContract, useContractRead, useOwnedNFTs, useTokenBalance, useWallet, Web3Button } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React, { useEffect, useState } from "react";
import styles from "./NFT.module.css";
import { nftDropAddress, nftDropContract, registryAddress, tokenBoundAccount, tokenBoundRegistry, vAstrContract, tokenAddress } from '../../const/constants';
import { ethers, Signer } from "ethers";
import SmartWalletConnected from "../SmartWallet/smartConnected";
import newSmartWallet from "../SmartWallet/SmartWallet";
import toastStyle from '../../util/toastConfig';
import { toWei } from "@thirdweb-dev/sdk";

type Props = {
  nft: NFT;
};

// Each NFT component shows the NFT image, name, and token ID.
export default function NFTComponent({ nft }: Props) {
  
  // const tokenBoundRegistry = "0xbf29146F8bC461d101D9Aa755cb84EfCF527Bd9d";
  // const vAstrContract = "0xe84Aa76A6600FB0D45B6e1761798dD74900cCF06";  // For test
  // const nftDropContract = "0x9927E162D13199FCE7Edf81210e4aD5304b97185";
  const { contract: tokenDrop } = useContract(
    vAstrContract,
    "token-drop"
  );
  const { contract: registryContract } = useContract(
    tokenBoundRegistry,
    "custom"
  );
  const { contract: nftDrop } = useContract(
    nftDropAddress,
    "nft-drop"
  );

  const { contract: tokenBoundRegistryContract } = useContract(
    tokenBoundRegistry,
    "custom"
  );
  
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );
  const [signer, setSigner] = useState<Signer>();

  // get the currently connected wallet
  const address = useAddress();
  const wallet = useWallet();

  const chainId = 6038361;
  const tokenId = 0;
  const salt = 0;

  const { data: tbaAddress } = useContractRead(tokenBoundRegistryContract, "account", [tokenBoundAccount, chainId, nftDropContract, tokenId, salt]);
  console.log("tbaAddress", tbaAddress);
  
  async function createAccount(id: string) {
    if (!address) return;

    console.log("withdraw", id);
    
    window.location.reload();
  }
  const { data: currentBalance } = useTokenBalance(tokenDrop, tbaAddress);
  useEffect(() => {
    const createSmartWallet = async (nft: NFT) => {
      if (nft && smartWalletAddress !== undefined && address && wallet) {
        // if (registryContract) {
        //   await registryContract.call("createAccount", [tokenBoundAccount, chainId, nftDropAddress, nft.metadata.id, 0, ethers.utils.toUtf8Bytes("")]);
        // }
        const tbaAccount = await registryContract?.call("account", [tokenBoundAccount, chainId, nftDropAddress, nft.metadata.id, 0])
        console.log("tbaAccount", tbaAccount);
        setSmartWalletAddress(await tbaAccount);
        
        // console.log("boundedAccount", boundedAccount);
        // const { data: tokenBalance, isLoading: loadingBalance } = useBalance();
        // console.log("tokenBalance", tokenBalance);
        // await smartWallet.connect({
        //   personalWallet: wallet,
        // });
        // setSigner(await smartWallet.getSigner());
        // console.log("signer", signer);
        // console.log("smart wallet address", await smartWallet.getAddress());
        return wallet;
      } else {
        console.log("smart wallet not created");
      }
    };
    createSmartWallet(nft);
  }, [nft, smartWalletAddress, address, wallet]);

  return (
    <>
    <p className={styles.tokenAddress}>TBA: {tbaAddress}</p>
    
      <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftImage} />
      
      <Web3Button
        contractAddress={tokenBoundRegistry}
        action={async (contract) => await contract.call("createAccount", [tokenBoundAccount, chainId, nftDropAddress, nft.metadata.id, 0, ethers.utils.toUtf8Bytes("")])}
        onSuccess={() => {
          console.log(`token bound account created!`);
        }}
        onError={(e) => {
          console.log(e);
          console.log(`NFT Claim Failed! Reason: ${(e as any).reason}`);
        }}
        >
          Create TBA
      </Web3Button>
      
      <Web3Button
        contractAddress={tbaAddress}
        action={async (contract) => await contract.call("withdrawToken", [vAstrContract, address, currentBalance?.value])}
        onSuccess={() => {
          console.log(`vASTR Withdrawn!`);
        }}
        onError={(e) => {
          console.log(e);
          console.log(`vASTR Withdrawn Failed! Reason: ${(e as any).reason}`);
        }}
        >
          Withdraw {currentBalance?.displayValue} vASTR
      </Web3Button>
    </>
  );
}
