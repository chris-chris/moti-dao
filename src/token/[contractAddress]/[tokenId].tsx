import {
  MediaRenderer,
  ThirdwebNftMedia,
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
  useWallet,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { activeChain, nftDropAddress, registryAddress } from "../../const/constants";
import styles from "../../../styles/Token.module.css";
import { Toaster } from "react-hot-toast";
import { Signer } from "ethers";
import SmartWalletConnected from "../../components/SmartWallet/smartConnected";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );
  const [signer, setSigner] = useState<Signer>();

  // get the currently connected wallet
  const address = useAddress();
  const wallet = useWallet();
  
  // const { contract } = useContract(nftDropAddress, "nft-drop");
  // const contractName  = useContractRead(contract, "name");
  const implementation = "";
  const chainId = 0;
  const tokenId = 0;
  const salt = 0;
  const { contract } = useContract(registryAddress, "custom");
  const boundedAccount = useContractRead(contract, "account", [implementation, chainId, nftDropAddress, tokenId, salt] );

  // create a smart wallet for the NFT
  useEffect(() => {
    const createSmartWallet = async (nft: NFT) => {
      if (nft  && address && wallet) {
        // const smartWallet = newSmartWallet(nft);
        console.log("personal wallet", address);
        console.log("nft", nft);
        const signer = await wallet.getSigner();
        console.log("signer", signer);
        console.log("contractMetadata", contractMetadata);
        
        console.log("boundedAccount", boundedAccount);
        // const { data: tokenBalance, isLoading: loadingBalance } = useBalance();
        // console.log("tokenBalance", tokenBalance);
        // await smartWallet.connect({
        //   personalWallet: wallet,
        // });
        // setSigner(await smartWallet.getSigner());
        // console.log("signer", signer);
        // setSmartWalletAddress(await smartWallet.getAddress());
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
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.image}
            />
          </div>

          <div className={styles.listingContainer}>
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  src={contractMetadata.image}
                  className={styles.collectionImage}
                />
                <p className={styles.collectionName}>{contractMetadata.name}</p>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
            {smartWalletAddress ? (
              <SmartWalletConnected signer={signer} />
            ) : (
              <div className={styles.btnContainer}>
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;

  const sdk = new ThirdwebSDK(activeChain);

  const contract = await sdk.getContract(nftDropAddress);

  const nft = await contract.erc721.get(tokenId);

  let contractMetadata;

  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) {}

  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
    revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK(activeChain);

  const contract = await sdk.getContract(nftDropAddress);

  const nfts = await contract.erc721.getAll();

  const paths = nfts.map((nft) => {
    return {
      params: {
        contractAddress: nftDropAddress,
        tokenId: nft.metadata.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
