FROM node:23-alpine3.20 AS builder

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm 

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]