import { Edge } from "database";
import { edgeRepository } from "../repository/index.js";
import { CreateEdgeInput, UpdateEdgeInput } from "../types/index.js";

export const getEdgeById = async (id: number): Promise<Edge | null> => {
  return edgeRepository.getEdge(id);
};

export const getEdgesByFolderId = async (
  folderId: number,
): Promise<Edge[] | null> => {
  return edgeRepository.getEdgesByFolderId(folderId);
};

export const getEdgesByFolderIdAndNodeIds = async (
  folderId: number,
  nodeIds: number[],
): Promise<Edge[]> => {
  return edgeRepository.getEdgesByFolderIdAndNodeIds(folderId, nodeIds);
};

export const getEdgesByNodeId = async (
  nodeId: number,
): Promise<Edge[] | null> => {
  return edgeRepository.getEdgesByNodeId(nodeId);
};

export const postEdge = async (input: CreateEdgeInput): Promise<Edge> => {
  return edgeRepository.postEdge(input);
};

export const updateEdgeById = async (
  id: number,
  input: UpdateEdgeInput,
): Promise<Edge> => {
  return edgeRepository.updateEdgeById(id, input);
};

export const deleteEdgeById = async (id: number): Promise<Edge | null> => {
  return edgeRepository.deleteEdgeById(id);
};

export const deleteEdgesByKnowledgeFolderId = async (
  knowledgeFolderId: number,
): Promise<number> => {
  return edgeRepository.deleteEdgesByKnowledgeFolderId(knowledgeFolderId);
};

export const deleteEdgesByFolderIdAndNodeIds = async (
  knowledgeFolderId: number,
  nodeIds: number[],
): Promise<number> => {
  return edgeRepository.deleteEdgesByFolderIdAndNodeIds(
    knowledgeFolderId,
    nodeIds,
  );
};
