FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY client/package.json ./client/

RUN pnpm install --recursive --frozen-lockfile

COPY client ./client

EXPOSE 3000

CMD ["pnpm", "-F", "client", "dev"]
