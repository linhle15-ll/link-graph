/**
 * API client for communicating with the backend server.
 * All functions are type-safe and handle errors consistently.
 */

import type {
  KnowledgeFolder,
  Node,
  Edge,
  CreateKnowledgeFolderInput,
  CreateNodeInput,
  UpdateNodeInput,
  CreateEdgeInput,
  UpdateEdgeInput,
} from "./types";

// Base API URL - should be configured via environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

/**
 * Wrapper for fetch with error handling and JSON parsing
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.data as T; // Backend wraps responses in { data: ... }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================================================
// Knowledge Folders
// ============================================================================

export async function getAllKnowledgeFolders(): Promise<{
  folders: KnowledgeFolder[];
}> {
  return fetchAPI("/knowledgeFolders");
}

export async function getKnowledgeFolderById(
  id: number,
): Promise<{ folder: KnowledgeFolder }> {
  return fetchAPI(`/knowledgeFolders/${id}`);
}

export async function createKnowledgeFolder(
  input: CreateKnowledgeFolderInput,
): Promise<{ folder: KnowledgeFolder }> {
  return fetchAPI("/knowledgeFolders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteKnowledgeFolder(
  id: number,
): Promise<{ deletedFolder: KnowledgeFolder }> {
  return fetchAPI(`/knowledgeFolders/${id}`, {
    method: "DELETE",
  });
}

// ============================================================================
// Nodes
// ============================================================================

export async function getNodesByFolderId(
  knowledgeFolderId: number,
): Promise<{ nodes: Node[] }> {
  return fetchAPI(`/nodes?knowledgeFolderId=${knowledgeFolderId}`);
}

export async function getNodeById(id: number): Promise<{ node: Node }> {
  return fetchAPI(`/nodes/${id}`);
}

export async function createNode(
  input: CreateNodeInput,
): Promise<{ node: Node }> {
  return fetchAPI("/nodes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateNode(
  id: number,
  input: UpdateNodeInput,
): Promise<{ node: Node }> {
  return fetchAPI(`/nodes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteNode(id: number): Promise<{ deletedNode: Node }> {
  return fetchAPI(`/nodes/${id}`, {
    method: "DELETE",
  });
}

/**
 * Update a node's position on the graph canvas
 */
export async function updateNodePosition(
  id: number,
  posX: number,
  posY: number,
): Promise<{ node: Node }> {
  return updateNode(id, { posX, posY });
}

/**
 * Toggle a node's visibility on the graph (add to/remove from graph)
 */
export async function updateNodeGraphVisibility(
  id: number,
  isOnGraph: boolean,
): Promise<{ node: Node }> {
  return updateNode(id, { isOnGraph });
}

// ============================================================================
// Edges
// ============================================================================

export async function getEdgesByFolderId(
  knowledgeFolderId: number,
): Promise<{ edges: Edge[] }> {
  return fetchAPI(`/edges?knowledgeFolderId=${knowledgeFolderId}`);
}

export async function getEdgeById(id: number): Promise<{ edge: Edge }> {
  return fetchAPI(`/edges/${id}`);
}

export async function createEdge(
  input: CreateEdgeInput,
): Promise<{ edge: Edge }> {
  return fetchAPI("/edges", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateEdge(
  id: number,
  input: UpdateEdgeInput,
): Promise<{ edge: Edge }> {
  return fetchAPI(`/edges/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteEdge(id: number): Promise<{ deletedEdge: Edge }> {
  return fetchAPI(`/edges/${id}`, {
    method: "DELETE",
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetch a complete folder with all its nodes and edges
 */
export async function getFolderWithContents(folderId: number): Promise<{
  folder: KnowledgeFolder;
  nodes: Node[];
  edges: Edge[];
}> {
  const [folderResult, nodesResult, edgesResult] = await Promise.all([
    getKnowledgeFolderById(folderId),
    getNodesByFolderId(folderId),
    getEdgesByFolderId(folderId),
  ]);

  return {
    folder: folderResult.folder,
    nodes: nodesResult.nodes,
    edges: edgesResult.edges,
  };
}

/**
 * Get only nodes that are visible on the graph (isOnGraph = true)
 */
export async function getNodesOnGraph(
  knowledgeFolderId: number,
): Promise<Node[]> {
  const { nodes } = await getNodesByFolderId(knowledgeFolderId);
  return nodes.filter((node) => node.isOnGraph);
}

/**
 * Get only nodes in storage (isOnGraph = false)
 */
export async function getNodesInStorage(
  knowledgeFolderId: number,
): Promise<Node[]> {
  const { nodes } = await getNodesByFolderId(knowledgeFolderId);
  return nodes.filter((node) => !node.isOnGraph);
}
