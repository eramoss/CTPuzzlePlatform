FROM node:14.18.0-alpine

WORKDIR /frontend

COPY package.json .
RUN rm -rf ./node_modules ./package-lock.json
RUN npm install



COPY . .

ARG NODE_ENV
ARG API_URL
RUN NODE_OPTIONS=--max-old-space-size=8192 npm run build

# Buildar
# docker image build -t frontend-platform:1.0 .
# docker image build -t registry.gitlab.com/cassiano.pvianna/ct-puzzle-platform/frontend:1.0 .
# docker push registry.gitlab.com/cassiano.pvianna/ct-puzzle-platform

# Rodar
# docker container run --rm --name frontend_platform -p 3000:3002 --env-file ../.env frontend-platform:1.0 
