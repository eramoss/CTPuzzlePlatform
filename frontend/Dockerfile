FROM node:12.20.0-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

ARG NODE_ENV
ARG baseURL

RUN npm run build

# Buildar
# docker image build -t frontend-platform:1.0 .
# docker image build -t registry.gitlab.com/cassiano.pvianna/ct-puzzle-platform/frontend:1.0 .
# docker push registry.gitlab.com/cassiano.pvianna/ct-puzzle-platform

# Rodar
# docker container run --rm --name frontend_platform -p 3000:3002 --env-file ../.env frontend-platform:1.0 