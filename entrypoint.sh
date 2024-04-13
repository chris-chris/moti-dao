#!/bin/sh -l

echo Creating deployer directory

mkdir ~/.config
mkdir ~/.config/dfx
mkdir ~/.config/dfx/identity
mkdir ~/.config/dfx/identity/default

echo Adding identity.pem and wallets file file

echo $INPUT_IDENTITY > ~/.config/dfx/identity/default/identity.pem
sed -i 's/\\r\\n/\r\n/g' ~/.config/dfx/identity/default/identity.pem
echo $INPUT_WALLETS > ~/.config/dfx/identity/default/wallets.json

which dfx

echo "Path:"

echo $PATH

dfxvm list

dfx --version

echo "Send Token from ledger: to $INPUT_DESTINATION with amount $INPUT_AMOUNT on network $INPUT_NETWORK"

dfx ledger --network=$INPUT_NETWORK transfer $INPUT_DFX_PARAMS $INPUT_DESTINATION --amount $INPUT_AMOUNT --memo $INPUT_MEMO
