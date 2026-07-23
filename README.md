## Overview

- `client/`: Next.js frontend
- `server/`: Express backend
- `docker-compose.yml`: local development containers
- `pnpm-workspace.yaml`: workspace package management

> Use `pnpm` for dependency management in this repository. Avoid `npm` and `yarn` unless explicitly required.

## Getting started

From the repository root:

```bash
pnpm install
pnpm dev # run both client and server from root
```

Run the workspace commands separately:

```bash
cd client
pnpm install
pnpm dev
```

```bash
cd server
pnpm install

# generate prisma client
pnpm prisma generate

pnpm dev
```

**Environment variables**

Create local `.env` files for each workspace if needed:

- `client/.env`
- `server/.env`

Copy values from the corresponding `.example.env` file.

Open the application on your localhost at:

```text
http://localhost:3000
```

- **Local dev**: http://localhost:3000
- **Docker client**: http://localhost:3001

## Docker

This project uses Docker named volumes for local container persistence during development.

The image is built once and then reused. If you only want to start the existing containers again, run:

```bash
docker compose up
```

Use:

```bash
docker compose up --build
```

only when the image definition itself changed, such as the `Dockerfile`, base image, or dependencies that must be baked into the container image.

Open the Dockerized client at:

```text
http://localhost:3001
```

- Remove the current container:

```bash
docker compose down
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

## Branch naming

Use consistent branch prefixes:

- `arch/<architecture-component-name>`
- `feature/<feature-name>`
- `bugfix/<bugfix-name>`
- `refactor/<refactor-name>`

## Code quality

When you commit code, this step is carried out automatically. Here are the manual steps:

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

## Working with database

The PostgreSQL database is set up in Docker using a named volume and Prisma ORM, which makes it easy to interact with the database from JavaScript. The database data persists locally on your machine, which is useful for testing and local development.

To work with database:

- Make sure you have turn on the docker container by `docker compose up`.
- Copy `.example.env` to a local `.env` and set the database URL, for example:

```text
DATABASE_URL=postgresql://postgres:postgresPassword@localhost:5432/link_graph?schema=public
```

```bash
cd server
pnpm prisma generate
```

Apply the schema to PostgreSQL/ if schema changes: Use migration for the normal workflow

```bash
pnpm prisma migrate dev
```

Then start app

```bash
pnpm dev
```

**Local testing - See the full Prisma schema**

Open the schema file directly: `/server/prisma/schema.prisma`

See the historical SQL change in: `/server/prisma/migrations/migration.sql`
