import { KnowledgeFile, prisma } from "database";
import { CreateKnowledgeFileInput } from "../types/index.js";

export const creatFile = async (
  title: string,
  userId: number,
): Promise<number> => {
  const file = await prisma.knowledgeFile.create({
    data: {
      title: title,
      userId: userId,
    },
  });
  return file.id;
};

export const getKnowledgeFilesByUserId = async (
  userId: number,
): Promise<KnowledgeFile[] | null> => {
  const files = await prisma.knowledgeFile.findMany({
    where: {
      userId: userId,
    },
  });
  return files;
};

export const getKnowledgeFileById = async (
  id: number,
): Promise<KnowledgeFile | null> => {
  const file = await prisma.knowledgeFile.findUnique({
    where: {
      id: id,
    },
  });
  return file;
};

export const getKnowledgeFileByTitle = async (
  title: string,
): Promise<KnowledgeFile | null> => {
  const file = await prisma.knowledgeFile.findUnique({
    where: {
      title: title,
    },
  });
  return file;
};

export const postKnowledgeFile = async (
  input: CreateKnowledgeFileInput,
): Promise<KnowledgeFile> => {
  const file = await prisma.knowledgeFile.create({
    data: input,
  });
  return file;
};

export const deleteKnowledgeFileById = async (
  id: number,
): Promise<KnowledgeFile> => {
  const deletedFile = await prisma.knowledgeFile.delete({
    where: {
      id: id,
    },
  });
  return deletedFile;
};

export const deleteKnowledgeFilesByUserId = async (
  userId: number,
): Promise<number | null> => {
  const deletedFiles = await prisma.knowledgeFile.deleteMany({
    where: {
      userId: userId,
    },
  });

  return deletedFiles.count > 0 ? deletedFiles.count : null;
};
