import { Node } from "database";
import { nodeRepository } from "../repository/index.js";
import { CreateNodeInput, RequestBody, compact } from "../types/index.js";
import { extractNodeMetadata } from "./extractionService.js";
import { summarizeNode } from "./summaryService.js";
import { detectEdgesForNode } from "./edgeDetectionService.js";

export const getNodeById = async (id: number): Promise<Node | null> => {
  return await nodeRepository.getNode(id);
};

export const getNodesByFileId = async (
  fileId: number,
): Promise<Node[] | null> => {
  return await nodeRepository.getNodesByFileId(fileId);
};

export const postNode = async (
  knowledgeFileId: number,
  link: string,
): Promise<Node | null> => {
  const { title, authors, source } = await extractNodeMetadata(link);
  const contentSummary = await summarizeNode(link);

  const input: CreateNodeInput = compact({
    title,
    authors,
    source,
    contentSummary,
    knowledgeFileId: knowledgeFileId,
    link: link,
  });

  const node = await nodeRepository.postNode(input);

  if (!node) {
    return null;
  }

  await detectEdgesForNode(node);

  return node;
};

export const deleteNodeById = async (id: number): Promise<Node | null> => {
  return nodeRepository.deleteNodeById(id);
};

export const deleteNodesByFileId = async (
  fileId: number,
): Promise<number | null> => {
  return nodeRepository.deleteNodesByFileId(fileId);
};
