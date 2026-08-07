import { prisma, Node } from "database";
import { CreateNodeInput } from "../types/index.js";

export const getNode = async (id: number): Promise<Node | null> => {
  return await prisma.node.findUnique({
    where: {
      id: id,
    },
  });
};

export const getAllNodes = async (): Promise<Node[] | null> => {
  return await prisma.node.findMany();
};

/**
 *
 * @param ids of nodes you want to get
 * @returns those nodes
 */
export const getNodes = async (ids: number[]): Promise<Node[] | null> => {
  return await prisma.node.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const getNodesByFileId = async (
  fileId: number,
): Promise<Node[] | null> => {
  return await prisma.node.findMany({
    where: {
      knowledgeFileId: fileId,
    },
  });
};

export const deleteNodeById = async (id: number): Promise<Node | null> => {
  const deletedNode = await prisma.node.delete({
    where: {
      id: id,
    },
  });
  return deletedNode;
};

export const deleteNodesByFileId = async (
  fileId: number,
): Promise<number | null> => {
  const deletedNodes = await prisma.node.deleteMany({
    where: {
      knowledgeFileId: fileId,
    },
  });

  return deletedNodes.count > 0 ? deletedNodes.count : null;
};

export const postNode = async (input: CreateNodeInput): Promise<Node> => {
  const node = await prisma.node.create({
    data: input,
  });
  return node;
};
