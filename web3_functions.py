# %%
from web3 import Web3
from web3.middleware import geth_poa_middleware
from web3.middleware import construct_sign_and_send_raw_middleware

import json
import os
import requests
from eth_account import Account
from eth_account.signers.local import LocalAccount

from collections import defaultdict
# %%

def send_reward(network_id:str, to_address: str, amount: float):
  # %%
  # Constants for the RPC URL and contract details
  if network_id == "astar-zkevm":
    RPC_URL = "https://rpc.startale.com/astar-zkevm"
    CONTRACT_ADDRESS = "0x7746ef546d562b443ae4b4145541a3b1a3d75717"
    CHAIN_ID = 3776
  elif network_id == "astar-zkyoto":
    RPC_URL = "https://rpc.startale.com/zkyoto"
    CONTRACT_ADDRESS = "0xe84Aa76A6600FB0D45B6e1761798dD74900cCF06"  # test ft contract
    CHAIN_ID = 6038361
  # %%
  w3 = Web3(Web3.HTTPProvider(RPC_URL))
  
  # Replace with your private key
  private_key = os.environ.get("VAULT_PRIVATE_KEY")
  # %%
  # Check if the private key is provided
  if not private_key:
      raise ValueError("Private key not provided.")

  account: LocalAccount = Account.from_key(private_key)
  w3.middleware_onion.add(construct_sign_and_send_raw_middleware(account))
  # Create a Web3 instance connected to the specified RPC URL
  w3 = Web3(Web3.HTTPProvider(RPC_URL))

  # Inject PoA middleware for networks using Proof of Authority consensus
  w3.middleware_onion.inject(geth_poa_middleware, layer=0)
  # %%
  # Check for connection to the Ethereum network
#   if not w3.isConnected():
#       raise ConnectionError("Failed to connect to HTTPProvider")

  # Load the contract ABI from a file
  # current_dir = os.path.dirname(os.path.realpath(__file__))
  current_dir = os.path.dirname(os.path.realpath(__file__))
  abi_path = os.path.join(current_dir, 'abi.json')
  with open(abi_path) as abi_file:
      contract_abi = json.load(abi_file)
  # %%
  # Create a contract object
  contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)
#   amount = 0.01
  # Define transaction details
  token_amount = w3.to_wei(amount, 'ether')  # Adjust the amount as needed
  # %%
  # Get the nonce for the transaction
  nonce = w3.eth.get_transaction_count(w3.eth.account.from_key(private_key).address)
  # %%

  balance = contract.functions.balanceOf(account.address).call()
  eth_balance = w3.eth.get_balance(account.address)

  print(f"Your balance is: {balance / (10**18)}")
  print(f"Your have {eth_balance/(10**18)} ETH for gas fees")
  # %%
  print(f"chainId: {CHAIN_ID}")
  # Build the transaction
  transaction = contract.functions.transfer(to_address, token_amount).build_transaction({
        'chainId': CHAIN_ID,
        'gas': 100000,
        'gasPrice': w3.to_wei('1', 'gwei'),
        'nonce': nonce,
    })

  # %%
  # Sign the transaction with the private key
  signed_txn = w3.eth.account.sign_transaction(transaction, private_key)

  # Attempt to send the transaction
  try:
      tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
      print(f"Transaction sent! Hash: {tx_hash.hex()}")
  except Exception as e:
      print(f"Error sending transaction: {e}")
# %%
