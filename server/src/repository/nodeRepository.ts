import { prisma, Node } from "database";
import { CreateNodeInput, UpdateNodeInput } from "../types/index.js";

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

export const getNodesByFolderId = async (
  folderId: number,
): Promise<Node[] | null> => {
  return await prisma.node.findMany({
    where: {
      knowledgeFolderId: folderId,
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

export const deleteNodesByFolderId = async (
  folderId: number,
): Promise<number | null> => {
  const deletedNodes = await prisma.node.deleteMany({
    where: {
      knowledgeFolderId: folderId,
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

export const updateNodeById = async (
  id: number,
  input: UpdateNodeInput,
): Promise<Node> => {
  const updatedNode = await prisma.node.update({
    where: {
      id: id,
    },
    data: input,
  });
  return updatedNode;
};
