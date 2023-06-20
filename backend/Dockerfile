FROM ubuntu:20.04

WORKDIR /backend

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update 
RUN apt-get -y upgrade --fix-missing
RUN apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        r-base -y \
        git \
        libssl-dev \
        npm\
        wget \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /usr/local/nvm 
ENV NVM_DIR /usr/local/nvm 
ENV NODE_VERSION 12.21.0

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.39.3/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH



RUN curl -fsSL https://deno.land/x/install/install.sh | sh

COPY package.json .
RUN npm install @types/estree@latest
RUN npm install

COPY . .

RUN Rscript R_install_packages.R


RUN npm run build

# Buildar
# docker image build -t backend-platform:1.0 .

# Rodar
# docker container run --rm --name backend_platform -p 3000:3002 --env-file ../.env backend-platform:1.0 