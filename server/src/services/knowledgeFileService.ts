import { KnowledgeFile } from "database";
import {
  edgeRepository,
  knowledgeFileRepository,
  nodeRepository,
} from "../repository/index.js";
import { CreateKnowledgeFileInput } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";
export const getKnowledgeFilesByUserId = async (userId: number) => {
  return await knowledgeFileRepository.getKnowledgeFilesByUserId(userId);
};
export const getKnowledgeFileById = async (userId: number) => {
  return await knowledgeFileRepository.getKnowledgeFileById(userId);
};

export const postKnowledgeFile = async (
  input: CreateKnowledgeFileInput,
): Promise<KnowledgeFile | null> => {
  const existingFile = await knowledgeFileRepository.getKnowledgeFileByTitle(
    input.title,
  );

  if (existingFile) {
    throw AppError.conflict("A knowledge file with this title already exists");
  }

  return await knowledgeFileRepository.postKnowledgeFile(input);
};

export const deleteKnowledgeFileById = async (id: number) => {
  await edgeRepository.deleteEdgesByKnowledgeFileId(id);
  await nodeRepository.deleteNodesByFileId(id);
  return await knowledgeFileRepository.deleteKnowledgeFileById(id);
};

export const deleteKnowledgeFilesByUserId = async (
  userId: number,
): Promise<number | null> => {
  return await knowledgeFileRepository.deleteKnowledgeFilesByUserId(userId);
};
