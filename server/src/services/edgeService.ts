import { Edge } from "database";
import { edgeRepository } from "../repository/index.js";
import { CreateEdgeInput, compact } from "../types/index.js";
import { scoreEdge } from "./edgeScoreService.js";

export const getEdgeById = async (id: number): Promise<Edge | null> => {
  return edgeRepository.getEdge(id);
};

export const getEdgesByFileId = async (
  fileId: number,
): Promise<Edge[] | null> => {
  return edgeRepository.getEdgesByFileId(fileId);
};

export const getEdgesByFileIdAndNodeIds = async (
  fileId: number,
  nodeIds: number[],
): Promise<Edge[]> => {
  return edgeRepository.getEdgesByFileIdAndNodeIds(fileId, nodeIds);
};

export const getEdgesByNodeId = async (
  nodeId: number,
): Promise<Edge[] | null> => {
  return edgeRepository.getEdgesByNodeId(nodeId);
};

export const deleteEdgeById = async (id: number): Promise<Edge | null> => {
  return edgeRepository.deleteEdgeById(id);
};

export const deleteEdgesByKnowledgeFileId = async (
  knowledgeFileId: number,
): Promise<number> => {
  return edgeRepository.deleteEdgesByKnowledgeFileId(knowledgeFileId);
};

export const deleteEdgesByFileIdAndNodeIds = async (
  knowledgeFileId: number,
  nodeIds: number[],
): Promise<number> => {
  return edgeRepository.deleteEdgesByFileIdAndNodeIds(knowledgeFileId, nodeIds);
};

export const postEdge = async (
  knowledgeFileId: number,
  nodeIds: number[],
  reason?: string,
): Promise<Edge> => {
  const score = await scoreEdge(nodeIds);

  const input: CreateEdgeInput = compact({
    knowledgeFileId,
    nodeIds,
    score,
    reason,
  });

  return edgeRepository.postEdge(input);
};
