# Nexus - Link Tree

This file is created as a ground truth for the purpose behind this project and the technical requirements.
As we develop this project, feel free to suggest changes to this file so we can stream line the development process.

## Context

When we get down to writing an essay/ a research paper, we have to look for a bunch of resources, clicking through hundreds of links and skimming through a bunch of articles and papers to find the most relevant one to our idea. That triggers a bunch of problems that might make the writing experience not as happy as it should be:

- It is super demanding and tiring in the long run
- People might find hard to keep track of what they have skimmed through and what content in each of the material
- Some might think of building a Sheet/ document hub/ graph to keep track of them, but the process might be manual
- AI tools for research? How about those who have trust issues and want to be themselves who hand pick the materials first - keep their knowledge base solid and still enjoy the real reference resources researching process.

## Solution

A web app + browser extension that helps users to connect all of the links they care about

### Web application:

Web application serves as a centralized platform containing many knowledge folders. Each of the knowledge folder serves as a workspace for the user to store their research resource link and work on their connections as well as content discovery right within the worksplace.

#### Main Objects - Nodes, Edges, and Knowledge Folders

Note: non "optional" noted field are compulsory, or else invalid

1. Nodes (`Node`):

- id
- link: Link to the content
- title: Title of the reading content contained in the link
- authors (optional): List of the authors of the reading content contained in the link
- contentSummary (optional): Summary of the content contained in the link
- edges (optional): Edges that the node is contingent on
- connectedNodes: List of other nodes in the same Knowledge Folder that the node is connecting to, default to empty list on create
- knowledgeFolderId: The Knowledge Folder (id) that the node is in, or the Knowledge Folder that the link was added to
- posX: X position on graph canvas
- posY: Y position on graph canvas
- isOnGraph: Whether the node is displayed on the grap (default to False)
- createdAt: time stamp on create
- updatedAt: time stamp on edit

2. Knowledge Folder (`KnowledgeFolder`)

- id
- title
- description (Optional)
- color: color of the folder
- nodes: list of link nodes that the Knowledge Folder currently contains, default to empty list on create
- edges: list of edges that the Knowledge Folder currently contains, default to empty list on create
- createdAt: time stamp on create
- updatedAt: time stamp on edit

3. Edge (`Edge`)

- id
- label (optional): some label to the edge by user
- reason: the reason for a connection/ edge in between two nodes
- score: measurement of how strong the connection between two nodes (range 0 - 100, not current UI )
- knowledgeFolder: the Knowledge Folder (id) that contains the edge
- firstNode: one of the two nodes that is contigent on the edge
- secondNode: one of the two nodes that is contigent on the edge
- createdAt: time stamp on create
- updatedAt: time stamp on edit

**Notes**:

- Edges are **undirected** - `firstNode` and `secondNode` have no hierarchical relationship.
- An edge connects exactly **two nodes**.
- Score range: **0-100** (higher = stronger connection)

Each of the knowledge folders has two main big components: (1) a node storage and (2) a knowledge graph:

### Main Components on pages

#### Home page: /

The main page displays:

- List of all Knowledge folders (as cards)
  - User can delete each of the folder card
- Create folder button
- Each Folder card shows:
  - Title
  - Description (if any)
  - Color indicator
  - Number of nodes and edges

#### Knowledge Folder page: `/knowledge-folder/:id`

Each Knowledge Folder page displays two main components side-by-side:

---

##### **1. Node Storage (Left Sidebar)**

**Purpose:** Contains all nodes (links) in the folder. Nodes start here with `isOnGraph = false`.

**Layout:**

- **"Add Link" button** at top - opens modal requiring:
  - Title (required)
  - URL (required)
- **Node list** below - each node tab displays:
  - Title
  - Root website (hostname)
  - Number of connected edges

**Node States:**

| State          | `isOnGraph` | Appearance                   | Actions Available          |
| -------------- | ----------- | ---------------------------- | -------------------------- |
| **In Storage** | `false`     | Clickable node tab           | Add to Graph, Edit, Delete |
| **On Graph**   | `true`      | "On Graph" badge, grayed out | Remove from Graph only     |

**User Actions (when `isOnGraph = false`):**

1. **Add to Graph**
   - Sets `isOnGraph = true`
   - Places node on canvas at default position
   - Node tab becomes unclickable/grayed
   - **Plan:** Triggers Edge Detection Service

2. **Edit Node** (opens inspector panel)
   - Title (editable)
   - Content Summary (editable)
   - Link URL (immutable - to change URL, create new node)

3. **Delete Node**
   - Permanently removes node
   - Only available when NOT on graph

**User Actions (when `isOnGraph = true`):**

1. **Remove from Graph**
   - Sets `isOnGraph = false`
   - Hides node from canvas
   - Deletes all connected edges
   - Node tab becomes clickable again

---

##### **Inspector Panel (Right Sidebar - appears on node click)**

Displays detailed node information when user clicks a node tab:

| Field           | Editable | Description                              |
| --------------- | -------- | ---------------------------------------- |
| Title           | True     | Node title                               |
| Link            | False    | URL (read-only, with "Open Link" button) |
| Content Summary | True     | User-added summary (initially blank)     |
| Authors         |          | Display only (if available)              |
| Source          |          | Display only (if available)              |

**Actions:**

- **Delete** button (only enabled when `isOnGraph = false`)
- 🔮 **Plan:** "Summarize" button - triggers Content Summary Service

---

##### **2. Knowledge Graph (Center Canvas)**

**Purpose:** Interactive canvas displaying only nodes where `isOnGraph = true`.

**Node Display on Canvas:**

- Title (truncated with "..." if too long)
- Source hostname
- User can click node to open inspector panel

**Features:**

| Feature         | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| **Drag Nodes**  | User can reorganize layout; positions (`posX`, `posY`) saved to database |
| **Create Edge** | Drag from one node to another to connect them                            |
| **Click Edge**  | Opens edge inspector panel (right sidebar)                               |

**Edge Creation:**

- User drags from one node to another
- Creates undirected edge connecting exactly two nodes
- Edge appears on canvas with optional label

---

##### **Edge Inspector Panel (Right Sidebar - appears on edge click)**

Displays when user clicks an edge on the canvas:

| Field           | Editable | Description                                     |
| --------------- | -------- | ----------------------------------------------- |
| Connected Nodes | False    | Shows firstNode → secondNode titles (read-only) |
| Label           | True     | Short relationship label (e.g., "builds on")    |
| Reasoning       | True     | Explanation of why nodes are connected          |
| Score           | True     | Strength slider (0-100)                         |

**Actions:**

- **Delete Edge** button
- **Plan:** Edge Detection Service suggests reasoning automatically

**Notes:**

- Current UI has an "Evidence" section for supporting quotes - currently disabled for MVP
- Manual edge creation only (no auto-detection in MVP)
- User is responsible for maintaining the knowledge graph; AI services will assist in future phases

### Google extension:

- User add the links to the graph through Google extension
- User hovers on the link to the reference resource that they potentially care about/ think that it might be helpful
- User double right clicks - open a dialog to decide whether to add this link to their selected knowledge folder, or create a new knowledge folder to add the link to if it has not existed yet (knowledge folder can also be created right on the web platform).
  (Plan) A feature (e.g. summary of content/ keywords highlighted based on user input of attentive topic) to help users decide whether to add this link to the knowledge folder on the web platform.
- If the user pick a folder and add the link there, that link is added to the respective knowledge folder on web platform.

### Authentication

**Current (MVP):**

- No authentication required
- Mock user (`userId = 1`) for testing
- All data accessible without login

### **Future Plans:**

#### **1. JWT Authentication**

- Basic login/logout/signup
- Users manually add links via web app

#### **2. OAuth (Google)**

- Login with Google account
- Browser extension synced with logged-in account
- Users can add links from any website via extension

## UI Flow

The flow in the web application is easy to follow:

- User can add the link to their selected folder via Google Extension (currently not implemented)
- Or user can go directly to the web app and manually add the link to the Knowledge Folders, following the user stories above.

---

## AI Features (Deferred to Future)

### **Content Summary Service**

- Auto-generate summaries from link content
- Triggered by user clicking "Summarize" button

### **Edge Detection Service**

- Automatically detect related nodes based on content
- Suggest edges with reasoning
- User can accept/reject suggestions

### **Evidence Extraction**

- Extract supporting quotes from linked content
- Attach as evidence to edges

---

## Development Phases

### **Phase 1: MVP (Current Focus)**

- Complete UI/UX design
- CRUD operations for Knowledge Folders, Nodes, Edges
- Backend-frontend connection
- Two-stage node behavior (Storage → Graph)
- Draggable nodes with position persistence
- Manual edge creation and editing
- No authentication (mock user)
- No AI services

### **Phase 2: Authentication**

- JWT-based login/logout/signup
- User account management
- Data isolation per user

### **Phase 3: Browser Extension**

- Chrome extension for adding links
- OAuth integration with Google
- Quick-add dialog

### **Phase 4: AI Features**

- Content summarization
- Edge detection and suggestions
- Evidence extraction

---

## Technical Stack

### **Frontend:**

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

### **Backend:**

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL database

### **Current API Endpoints:**

| Method   | Endpoint                    | Description                             |
| -------- | --------------------------- | --------------------------------------- |
| `GET`    | `/api/knowledgeFolders`     | Get all folders for user                |
| `POST`   | `/api/knowledgeFolders`     | Create new folder                       |
| `GET`    | `/api/knowledgeFolders/:id` | Get folder by ID                        |
| `DELETE` | `/api/knowledgeFolders/:id` | Delete folder                           |
| `GET`    | `/api/nodes?folderId=1`     | Get all nodes in folder                 |
| `POST`   | `/api/nodes`                | Create new node                         |
| `PATCH`  | `/api/nodes/:id`            | Update node (position, isOnGraph, etc.) |
| `DELETE` | `/api/nodes/:id`            | Delete node                             |
| `GET`    | `/api/edges?folderId=1`     | Get all edges in folder                 |
| `POST`   | `/api/edges`                | Create new edge                         |
| `PATCH`  | `/api/edges/:id`            | Update edge (label, reasoning, score)   |
| `DELETE` | `/api/edges/:id`            | Delete edge                             |

---

## Glossary

- **Node** - A saved link/resource with metadata
- **Edge** - A connection between two nodes showing their relationship
- **Knowledge Folder** - A container/workspace holding nodes and edges
- **Node Storage** - Left sidebar showing all nodes in folder
- **Knowledge Graph** - Canvas displaying nodes and their connections
- **isOnGraph** - Boolean flag determining if node is visible on canvas
- **Score** - Strength of edge connection (0-100 scale)

---

_Last Updated: 2026-08-07_
