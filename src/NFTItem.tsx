import { ConnectWallet, ThirdwebNftMedia, useAddress, useContract, useContractRead, useOwnedNFTs, useTokenBalance, Web3Button } from "@thirdweb-dev/react";
import "./styles/Home.css";
import { tokenBoundRegistry, tokenBoundAccount, vAstrContract, nftDropContract, activeChain } from "./const/constants";


export default function Home() {
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
  const {
    data: ownedNfts,
    isLoading,
    isError,
  } = useOwnedNFTs(nftDrop, address);

  const { data: currentBalance } = useTokenBalance(tokenDrop, address);
  const tokenId = 0;
  const salt = 0;

  const { data: tbaAddress } = useContractRead(tokenBoundRegistryContract, "account", [tokenBoundAccount, activeChain.chainId, nftDropContract, tokenId, salt]);
  console.log("tbaAddress", tbaAddress);
  // tokenId:0 => 0x941a33A0D9Ad5Cb1E4529d01d816723D15b99443

  async function getBalance(wallet_address: string){}

  async function withdraw(id: string) {
    if (!address) return;

    console.log("withdraw", id);
    
    // retrieve tokenBountAddress from registry
    

    // // The contract requires approval to be able to transfer the pickaxe
    // const hasApproval = await pickaxeContract.isApproved(
    //   address,
    //   MINING_CONTRACT_ADDRESS
    // );

    // if (!hasApproval) {
    //   await pickaxeContract.setApprovalForAll(MINING_CONTRACT_ADDRESS, true);
    // }

    // await miningContract.call("stake", [id]);

    // Refresh the page
    window.location.reload();
  }
  return (
    <main className="main">
      <div className="container">
        <div className="header">
          <h1 className="title">
            Welcome to{" "}
            <span className="gradient-text-0">
              <a
                href="https://thirdweb.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                moti-dao.
              </a>
            </span>
          </h1>

          <p className="description">
            Earn vASTR by contributing Open Source projects!
          </p>

          <div className="connect">
            <ConnectWallet />
          </div>
        </div>

        Current Balance: {currentBalance?.displayValue} vASTR

        {ownedNfts?.map((p) => (
          <div  key={p.metadata.id.toString()}>
            <ThirdwebNftMedia
              metadata={p.metadata}
              height={"64"}
            />
            <h3>{p.metadata.name}</h3>

            <div>
              <Web3Button
                theme="dark"
                contractAddress={tokenBoundRegistry}
                action={() => withdraw(p.metadata.id)}
              >
                Withdraw $vASTR
              </Web3Button>
            </div>
          </div>
        ))}

        <br></br>

        <div className="grid">
          <a
            href="https://portal.thirdweb.com/"
            className="card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/portal-preview.png"
              alt="Placeholder preview of starter"
            />
            <div className="card-text">
              <h2 className="gradient-text-1">Sign Up as Engineer ➜</h2>
              <p>
                Guides, references, and resources that will help you build with
                thirdweb.
              </p>
            </div>
          </a>

          <a
            href="https://thirdweb.com/dashboard"
            className="card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/dashboard-preview.png"
              alt="Placeholder preview of starter"
            />
            <div className="card-text">
              <h2 className="gradient-text-2">Open Task List ➜</h2>
              <p>
                Discuss, Code, and Earn vASTR by contributing to Open Source
              </p>
            </div>
          </a>

          <a
            href="https://thirdweb.com/templates"
            className="card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/templates-preview.png"
              alt="Placeholder preview of templates"
            />
            <div className="card-text">
              <h2 className="gradient-text-3">Reward Record ➜</h2>
              <p>
                Discover how much I have earned and how much I can earn by
              </p>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
