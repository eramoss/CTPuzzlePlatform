FROM node:14.18.0-alpine

WORKDIR /backend

RUN apk update
RUN apk upgrade
RUN apk --no-cache add curl
RUN apk --no-cache add r-base 
RUN curl -fsSL https://deno.land/x/install/install.sh | sh

COPY package.json .
RUN rm -rf ./node_modules ./package-lock.json

RUN npm install
RUN npm install @types/estree@latest
COPY . .

RUN Rscript R_install_packages.R

RUN npm run build

# Buildar
# docker image build -t backend-platform:1.0 .

# Rodar
# docker container run --rm --name backend_platform -p 3000:3002 --env-file ../.env backend-platform:1.0 