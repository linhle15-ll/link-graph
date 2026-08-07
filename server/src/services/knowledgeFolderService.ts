import { KnowledgeFolder } from "database";
import {
  edgeRepository,
  knowledgeFolderRepository,
  nodeRepository,
} from "../repository/index.js";
import { CreateKnowledgeFolderInput } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export const getKnowledgeFoldersByUserId = async (userId: number) => {
  const folders =
    await knowledgeFolderRepository.getKnowledgeFoldersByUserId(userId);

  // Add counts for each folder
  const foldersWithCounts = await Promise.all(
    (folders || []).map(async (folder) => {
      const nodes = await nodeRepository.getNodesByFolderId(folder.id);
      const edges = await edgeRepository.getEdgesByFolderId(folder.id);
      return {
        ...folder,
        nodeCount: nodes?.length || 0,
        edgeCount: edges?.length || 0,
      };
    }),
  );

  return foldersWithCounts;
};

export const getKnowledgeFolderById = async (id: number) => {
  return await knowledgeFolderRepository.getKnowledgeFolderById(id);
};

export const postKnowledgeFolder = async (
  input: CreateKnowledgeFolderInput,
): Promise<KnowledgeFolder | null> => {
  const existingFolder =
    await knowledgeFolderRepository.getKnowledgeFolderByTitle(input.title);

  if (existingFolder) {
    throw AppError.conflict(
      "A knowledge folder with this title already exists",
    );
  }

  return await knowledgeFolderRepository.postKnowledgeFolder(input);
};

export const deleteKnowledgeFolderById = async (id: number) => {
  await edgeRepository.deleteEdgesByKnowledgeFolderId(id);
  await nodeRepository.deleteNodesByFolderId(id);
  return await knowledgeFolderRepository.deleteKnowledgeFolderById(id);
};

export const deleteKnowledgeFoldersByUserId = async (
  userId: number,
): Promise<number | null> => {
  return await knowledgeFolderRepository.deleteKnowledgeFoldersByUserId(userId);
};
