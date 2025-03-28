FROM node:18.14.1-bullseye

WORKDIR /backend

# install deps 
RUN apt-get update && apt-get install -y --no-install-recommends \
    r-base \
    curl \
    gcc \
    g++ \
    make \
    libc-dev 

RUN curl -fsSL https://deno.land/x/install/install.sh | sh

COPY package.json .
RUN npm install @types/estree@latest
RUN npm install

COPY R_install_packages.R .
COPY R_packages_dependencies.csv .

RUN Rscript R_install_packages.R
COPY . .

RUN npm run build
