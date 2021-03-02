FROM node:12.20.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install

ENV baseURL http://localhost:3001
ENV NODE_ENV production

COPY . .

EXPOSE 3000:3002

RUN npm run build

CMD ["npm", "start"]

# Buildar
# docker image build -t frontend-plat:1.0 .

# Rodar
# docker container run --rm --name frontend_platform -p 3000:3002 --env-file ../.env frontend-plat:1.0 