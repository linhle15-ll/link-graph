/**
 * Shared frontend types.
 * These mirror server/prisma/schema.prisma — keep them in sync.
 */

export interface KnowledgeFile {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
}

/** A research source ingested from a link (via the Chrome extension or manual add). */
export interface GraphNode {
  id: number;
  title: string;
  link: string;
  contentSummary: string;
  text: string | null;
  tags: string[];
  author: string;
  site: string;
  createdAt: string;
  knowledgeFileId: number;
}

/**
 * A relationship detected by the edge-detection (NLP) service.
 * In the database an Edge connects Nodes through the NodeEdge join table,
 * so the API returns the connected node ids as `nodeIds` (always 2 for now).
 */
export interface GraphEdge {
  id: number;
  score: number; // NLP confidence, 0–1
  reason: string; // why the services linked these nodes
  tags: string[];
  createdAt: string;
  knowledgeFileId: number;
  nodeIds: number[];
}

/** Response shape of GET /api/graph */
export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** Response shape of POST /api/links */
export interface AddLinkResponse {
  node: GraphNode;
}

/** Mirrors the User model (never includes password on the client). */
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

/** Response shape of POST /api/auth/login and /api/auth/signup */
export interface AuthResponse {
  user: User;
}

/**
 * A knowledge session: a workspace grouping sources into one graph.
 * (Backed by the KnowledgeFile model once its relations are 1-to-many.)
 */
export interface Session {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  nodeCount: number;
}
