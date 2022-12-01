FROM node:19

RUN apt update -y && apt upgrade -y

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN npx tsc

ENV NODE_ENV "production"

ENTRYPOINT ["node", "dist/server/server.js"]