import { ThirdwebNftMedia, useAddress, useContract, useContractRead, useOwnedNFTs, useTokenBalance, Web3Button } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "./NFT.module.css";
import { nftDropAddress, registryAddress, implementation } from "../../const/constants";


type Props = {
  nft: NFT;
};

// Each NFT component shows the NFT image, name, and token ID.
export default function NFTComponent({ nft }: Props) {
  
  const tokenBoundRegistry = "0xbf29146F8bC461d101D9Aa755cb84EfCF527Bd9d";
  const vAstrContract = "0xe84Aa76A6600FB0D45B6e1761798dD74900cCF06";  // For test
  const nftDropContract = "0x9927E162D13199FCE7Edf81210e4aD5304b97185";
  const { contract: tokenDrop } = useContract(
    vAstrContract,
    "token-drop"
  );
  const { contract: nftDrop } = useContract(
    nftDropContract,
    "nft-drop"
  );

  const { contract: tokenBoundRegistryContract } = useContract(
    tokenBoundRegistry,
    "custom"
  );
  
  const address = useAddress();

  const implementation = "0xfdBF1e66Cc6a874Dfb2d6ae856C09A72239E8BE8"; // SimpleERC6551Account
  const chainId = 6038361;
  const tokenId = 0;
  const salt = 0;

  const { data: tbaAddress } = useContractRead(tokenBoundRegistryContract, "account", [implementation, chainId, nftDropContract, tokenId, salt]);
  console.log("tbaAddress", tbaAddress);
  
  const { data: currentBalance } = useTokenBalance(tokenDrop, tbaAddress);
  return (
    <>
      <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftImage} />
      {/* <div><p className={styles.nftTokenId}>Token ID #{nft.metadata.id}</p></div> */}
      
      <p className={styles.nftTokenId}>{nft.metadata.name}</p>
      <p className={styles.nftTokenId}> TBA Reward Balance: {currentBalance?.displayValue} vASTR</p>

        
    </>
  );
}
