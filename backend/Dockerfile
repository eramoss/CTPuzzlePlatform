FROM node:18.14.1-alpine

WORKDIR /backend

# install deps 
RUN apk add --no-cache \
    R \
    R-dev \
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