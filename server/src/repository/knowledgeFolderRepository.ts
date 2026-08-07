import { KnowledgeFolder, prisma } from "database";
import { CreateKnowledgeFolderInput } from "../types/index.js";

export const createFolder = async (
  title: string,
  userId: number,
): Promise<number> => {
  const folder = await prisma.knowledgeFolder.create({
    data: {
      title: title,
      userId: userId,
    },
  });
  return folder.id;
};

export const getKnowledgeFoldersByUserId = async (
  userId: number,
): Promise<KnowledgeFolder[] | null> => {
  const folders = await prisma.knowledgeFolder.findMany({
    where: {
      userId: userId,
    },
  });
  return folders;
};

export const getKnowledgeFolderById = async (
  id: number,
): Promise<KnowledgeFolder | null> => {
  const folder = await prisma.knowledgeFolder.findUnique({
    where: {
      id: id,
    },
  });
  return folder;
};

export const getKnowledgeFolderByTitle = async (
  title: string,
): Promise<KnowledgeFolder | null> => {
  const folder = await prisma.knowledgeFolder.findUnique({
    where: {
      title: title,
    },
  });
  return folder;
};

export const postKnowledgeFolder = async (
  input: CreateKnowledgeFolderInput,
): Promise<KnowledgeFolder> => {
  const folder = await prisma.knowledgeFolder.create({
    data: input,
  });
  return folder;
};

export const deleteKnowledgeFolderById = async (
  id: number,
): Promise<KnowledgeFolder> => {
  const deletedFolder = await prisma.knowledgeFolder.delete({
    where: {
      id: id,
    },
  });
  return deletedFolder;
};

export const deleteKnowledgeFoldersByUserId = async (
  userId: number,
): Promise<number | null> => {
  const deletedFolders = await prisma.knowledgeFolder.deleteMany({
    where: {
      userId: userId,
    },
  });

  return deletedFolders.count > 0 ? deletedFolders.count : null;
};
