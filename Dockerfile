# FROM node:16-alpine3.11
FROM --platform=amd64 chrisai/dfx:python3

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:$PATH"
ENV PATH="/root/.local/share/dfx/bin:$PATH"
ENV DFX_VERSION=0.16.1

# USER node

WORKDIR /root

COPY dfx-install.sh /home/dfx-install.sh
COPY entrypoint.sh /home/node/entrypoint.sh
COPY evaluate_reward.py /home/node/evaluate_reward.py

RUN echo '6' | apt-get install -y npm

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.17.0
RUN mkdir -p /usr/local/nvm && apt-get update && echo "y" | apt-get install curl

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH

# RUN nvm install node

RUN echo '6' | npm install -g near-cli

RUN ["chmod", "+x", "/home/node/entrypoint.sh"]

# RUN echo $(dfx --version)

# RUN dfxvm default 0.18.0

CMD sh /home/node/entrypoint.sh