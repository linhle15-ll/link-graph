/** Client types matching the backend schema exactly. */

export type KnowledgeFolder = {
  id: number;
  title: string;
  description: string | null;
  color: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  nodeCount?: number;
  edgeCount?: number;
};

export type Node = {
  id: number;
  title: string;
  link: string;
  authors: string[];
  source: string | null;
  contentSummary: string | null;
  posX: number | null;
  posY: number | null;
  isOnGraph: boolean;
  knowledgeFolderId: number;
  createdAt: string;
  updatedAt: string;
};

export type Edge = {
  id: number;
  label: string | null;
  reasoning: string | null;
  score: number | null;
  firstNodeId: number;
  secondNodeId: number;
  knowledgeFolderId: number;
  createdAt: string;
  updatedAt: string;
  // Populated relations from backend
  firstNode?: Node;
  secondNode?: Node;
};

/** API request/response types */

export type CreateKnowledgeFolderInput = {
  title: string;
  description?: string;
  color?: string;
};

export type CreateNodeInput = {
  title: string;
  link: string;
  knowledgeFolderId: number;
  contentSummary?: string;
  posX?: number;
  posY?: number;
  isOnGraph?: boolean;
};

export type UpdateNodeInput = {
  title?: string;
  contentSummary?: string;
  posX?: number;
  posY?: number;
  isOnGraph?: boolean;
};

export type CreateEdgeInput = {
  knowledgeFolderId: number;
  firstNodeId: number;
  secondNodeId: number;
  label?: string;
  reasoning?: string;
  score?: number;
};

export type UpdateEdgeInput = {
  label?: string;
  reasoning?: string;
  score?: number;
};

/** UI/Graph display types */

export type LinkNode = {
  id: number;
  folderId: number;
  title: string;
  url: string;
  description: string | null;
  posX: number;
  posY: number;
};

export type GraphEdge = {
  id: number;
  folderId: number;
  sourceId: number;
  targetId: number;
  label: string | null;
  reasoning: string | null;
  strength: number;
  evidence: EdgeEvidence[];
};

export type EdgeEvidence = {
  id: number;
  quote: string;
  source: string | null;
};

/** Legacy placeholder types (for placeholder-content.ts) */
export type FolderSummary = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  linkCount: number;
  edgeCount: number;
};
