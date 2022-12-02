FROM node:19

RUN apt update -y && apt upgrade -y

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN npm install -g pnpm
RUN pnpm install

COPY src src
COPY next.config.cjs next.config.cjs 
COPY next-env.d.ts next-env.d.ts 
COPY tsconfig.json tsconfig.json

RUN npx tsc
RUN npx next build

ENV NODE_ENV "production"

ENTRYPOINT ["node", "dist/server/server.js"]