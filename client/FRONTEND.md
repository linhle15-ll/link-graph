# Nexus — Frontend

Knowledge sessions that turn saved links into a graph of connected sources.
Built to match the Figma design (Nexus).

## Run it

```bash
pnpm install                 # deps: @xyflow/react, zustand, @dagrejs/dagre
cp client/.example.env client/.env.local
pnpm --filter client dev
```

With `NEXT_PUBLIC_USE_MOCK=true` (default in `.example.env`) the app runs on
an in-memory fixture — no server needed. Once server routes exist, set it to
`false` and point `NEXT_PUBLIC_API_URL` at the API
(`http://localhost:5001/api` with docker-compose).

## Pages (per the Figma design)

| Route               | Design frame       | What it does                                                                                                                                                          |
| ------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`, `/signup` | "Write it better." | Split panel: network art, sign in/up toggle, email+password, Google button                                                                                            |
| `/home`             | Session grid       | Knowledge session cards, header search filters them, black **+** button opens the create dialog                                                                       |
| `/sessions/[id]`    | Graph view         | Sources sidebar (checkboxes toggle node visibility, add-link input), circular nodes, cyan **Agrees** / magenta **Disagrees** edges, legend, collapsible Summary panel |
| `/user`             | User Center        | Username / email / password update                                                                                                                                    |

## What's where

```
app/(auth)/login, signup                 Auth pages (shared AuthForm)
app/(app)/home/page.tsx                  Session grid + create dialog + floating +
app/(app)/sessions/[id]/page.tsx         Graph workspace for one session
app/(app)/user/page.tsx                  User Center
components/layout/app-header.tsx         Nexus header: brand, search pill, user icons
components/auth/auth-form.tsx            Toggle tabs, Google sign-in, network art
components/graph/graph-canvas.tsx        React Flow canvas (per-session)
components/graph/circle-node.tsx         Dark circular node, cyan ring when selected
components/graph/relation-edge.tsx       Straight edge: agrees=cyan, disagrees=magenta
components/graph/sources-sidebar.tsx     Checkbox visibility list + add link
components/graph/summary-panel.tsx       Collapsible summary of the selected node
components/graph/graph-legend.tsx        Agrees/Disagrees legend
hooks/use-sessions.ts                    useSessions, useCreateSession
hooks/use-graph.ts                       useGraph(sessionId) polls 10s, useAddLink, useDeleteEdge
stores/graph-store.ts                    Selection, hidden nodes, panel toggles
stores/ui-store.ts                       Header search
stores/auth-store.ts                     Signed-in user (display only)
lib/api.ts                               REST client + mock switch (only file that talks to the server)
lib/types.ts                             Mirrors server/prisma/schema.prisma (+ Session)
lib/graph-layout.ts                      Dagre auto-layout for circles
lib/mock-graph.ts                        Sessions + graphs fixture for mock mode
```

Server data lives in the TanStack Query cache (graph polls every 10s so
extension-clipped links appear); Zustand holds only interaction state.

## API contract the server needs to implement

All under `/api` (routes currently commented out in `server/src/app.ts`).
The frontend sends `credentials: "include"` — use an httpOnly session cookie.

Auth:

- `POST /api/auth/signup` `{ name, email, password }` → `{ user: { id, name, email, createdAt } }` (never the password hash)
- `POST /api/auth/login` `{ email, password }` → same shape
- `POST /api/auth/logout` → clears the cookie
- `PATCH /api/auth/me` `{ name, email, password? }` → `{ user }` (User Center)
- `GET  /api/auth/me` → `{ user }` (recommended, to rehydrate after reload)
- `GET  /api/auth/google` → OAuth redirect (the Google button points here)

Sessions:

- `GET  /api/sessions` → `{ sessions: [{ id, title, description, createdAt, nodeCount }] }`
- `POST /api/sessions` `{ title, description }` → `{ session }`

Graph (per session):

- `GET  /api/sessions/:id/graph` → `{ nodes: [...], edges: [...] }` — node fields
  mirror the Prisma Node model; each edge includes `nodeIds: [a, b]` resolved
  through the NodeEdge join, and its first tag should be `"agrees"` or
  `"disagrees"` (drives edge color)
- `POST /api/sessions/:id/links` `{ url }` → `{ node }` (returned immediately as
  pending; same endpoint the Chrome extension calls)
- `DELETE /api/edges/:id` → removes a wrong NLP connection (delete NodeEdge rows first)

### Schema notes

1. `Node.knowledgeFileId` / `Edge.knowledgeFileId` are `@unique`, making the
   KnowledgeFile relations 1-to-1 despite `nodes Node[]` / `edges Edge[]`.
   For sessions to group many sources, drop the `@unique` and migrate.
2. There is no Session/workspace model yet. Either promote KnowledgeFile to
   that role (add a `userId`, treat it as the session) or add a `Session`
   model that Nodes/Edges reference.
3. For Google OAuth later: make `User.password` optional and add
   `provider` / `providerId` columns.
