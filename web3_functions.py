from web3 import Web3
from web3.middleware import geth_poa_middleware
import json
import os
import requests

from collections import defaultdict


def send_reward(network_id:str, to_address: str, amount: float):
  # %%
  print(w3.isConnected())
  # Constants for the RPC URL and contract details
  if network_id == "astar-zkevm":
    RPC_URL = "https://rpc.startale.com/astar-zkevm"
    CONTRACT_ADDRESS = "0x7746ef546d562b443ae4b4145541a3b1a3d75717"
  elif network_id == "astar-zkyoto":
    RPC_URL = "https://rpc.startale.com/zkyoto"
    CONTRACT_ADDRESS = "0xe84Aa76A6600FB0D45B6e1761798dD74900cCF06"  # test ft contract

  w3 = Web3(Web3.HTTPProvider(RPC_URL))
  
  # Replace with your private key
  private_key = os.environ.get("VAULT_PRIVATE_KEY")

  # Check if the private key is provided
  if not private_key:
      raise ValueError("Private key not provided.")

  # Create a Web3 instance connected to the specified RPC URL
  w3 = Web3(Web3.HTTPProvider(RPC_URL))

  # Inject PoA middleware for networks using Proof of Authority consensus
  w3.middleware_onion.inject(geth_poa_middleware, layer=0)

  # Check for connection to the Ethereum network
  if not w3.isConnected():
      raise ConnectionError("Failed to connect to HTTPProvider")

  # Load the contract ABI from a file
  with open('abi.json') as abi_file:
      contract_abi = json.load(abi_file)

  # Create a contract object
  contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

  # Define transaction details
  token_amount = w3.toWei(amount, 'ether')  # Adjust the amount as needed

  # Get the nonce for the transaction
  nonce = w3.eth.getTransactionCount(w3.eth.account.privateKeyToAccount(private_key).address)

  # Build the transaction
  transaction = contract.functions.transfer(to_address, token_amount).buildTransaction({
      'chainId': w3.eth.chain_id,
      'gas': 2000000,  # Adjust the gas limit as needed
      'nonce': nonce,
  })

  # Sign the transaction with the private key
  signed_txn = w3.eth.account.sign_transaction(transaction, private_key)

  # Attempt to send the transaction
  try:
      tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
      print(f"Transaction sent! Hash: {tx_hash.hex()}")
  except Exception as e:
      print(f"Error sending transaction: {e}")