FROM node:20.16-bullseye

WORKDIR /frontend

COPY package.json .
RUN rm -rf ./node_modules ./package-lock.json
RUN npm install


COPY . .

ARG NODE_ENV
ARG API_URL
ARG FRONTEND_PREFIX
RUN NODE_OPTIONS=--max-old-space-size=8192 npm run build
