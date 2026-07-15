FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json ./server/

RUN pnpm install --recursive --frozen-lockfile

COPY server ./server

EXPOSE 5000

CMD ["pnpm", "-F", "server", "dev"]
