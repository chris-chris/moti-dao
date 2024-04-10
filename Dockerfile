# FROM node:16-alpine3.11
FROM --platform=amd64 chrisai/moti-dao:latest

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:$PATH"

WORKDIR /root

COPY evaluate_reward.py /home/node/evaluate_reward.py
COPY web3_functions.py /home/node/web3_functions.py
COPY abi.json /home/node/abi.json
