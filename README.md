# Fullstack Template

A starter repository for a fullstack web application with separate `client/` and `server/` workspaces.

## Repository structure

```text
fullstack-template/
├── .github/
│   └── workflows/
│       ├── client.yml
│       ├── server.yml
│       └── docker.yml
├── .husky/
│   └── pre-commit
├── .prettierrc
├── .prettierignore
├── pnpm-workspace.yaml
├── docker-compose.yml
├── client/
└── server/
```

## Overview

- `client/`: Next.js frontend
- `server/`: Express backend
- `docker-compose.yml`: local development containers
- `pnpm-workspace.yaml`: workspace package management

## Prerequisites

- Node.js 18+
- `pnpm` installed globally
- Docker Desktop for containerized development (optional)

> Use `pnpm` for dependency management in this repository. Avoid `npm` and `yarn` unless explicitly required.

## Getting started

From the repository root:

```bash
pnpm install
pnpm dev
```

If root scripts are not available, run the workspace commands separately:

```bash
cd client
pnpm install
pnpm dev
```

```bash
cd server
pnpm install
pnpm dev
```

## Frontend

Open the frontend in your browser at:

```text
http://localhost:3000
```

Edit `client/app/page.tsx` to begin customizing the UI.

## Backend

The server runs with its own configuration and environment variables. Confirm the configured port in `server/src/server.ts` or `server/src/app.ts`.

## Environment variables

Create local `.env` files for each workspace if needed:

- `client/.env`
- `server/.env`

Copy values from the corresponding `example.env` file, if available.

## Branch naming

Use consistent branch prefixes:

- `feature/<feature-name>`
- `bugfix/<bugfix-name>`
- `refactor/<refactor-name>`

## Code quality

Before committing changes:

```bash
pnpm lint
pnpm lint-staged
pnpm prettier --write .
```

Or format only the client workspace:

```bash
pnpm prettier --write client
```

## Server setup notes

The backend includes common TypeScript and Express dependencies such as:

- `express`
- `cors`
- `cookie-parser`
- `dotenv`
- `morgan`
- `typescript`
- `tsx`
- `eslint`
- `@types/node`
- `@types/express`
- `@types/cors`
- `@types/morgan`
- `@types/cookie-parser`

## Docker

Run the app with Docker Compose:

```bash
docker compose down
docker compose up --build
```

Inspect status and logs:

```bash
docker ps
docker compose logs --tail 10
```

**Open browser when Docker compose is up:**
Using http://localhost:3001/, `PORT=3001`

In docker-compose.yml, we set PORTS in client is `3001:3000` which means `HOST_PORT:CONTAINER_PORT`, or when you visit `localhost:3001` in your browser on your port, Docker forward that traffic to port 3000 inside the container where Next.js is listening.

You can only acccess http://localhost:3001/ if Docker compose is down because `localhost:3000` is now not in a separed container anymore but on your local machine.
