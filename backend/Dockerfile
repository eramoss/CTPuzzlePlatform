FROM node:12.20.0-alpine

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Buildar
# docker image build -t backend-platform:1.0 .

# Rodar
# docker container run --rm --name backend_platform -p 3000:3002 --env-file ../.env backend-platform:1.0 