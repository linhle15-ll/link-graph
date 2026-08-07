import { prisma, Edge } from "database";
import { CreateEdgeInput, UpdateEdgeInput } from "../types/index.js";

export const getEdge = async (id: number): Promise<Edge | null> => {
  return await prisma.edge.findUnique({
    where: {
      id: id,
    },
    include: {
      firstNode: true,
      secondNode: true,
    },
  });
};

export const getEdgesByFolderId = async (
  folderId: number,
): Promise<Edge[] | null> => {
  return await prisma.edge.findMany({
    where: {
      knowledgeFolderId: folderId,
    },
    include: {
      firstNode: true,
      secondNode: true,
    },
  });
};

export const getEdgesByFolderIdAndNodeIds = async (
  folderId: number,
  nodeIds: number[],
): Promise<Edge[]> => {
  const edges = await prisma.edge.findMany({
    where: {
      knowledgeFolderId: folderId,
      OR: [{ firstNodeId: { in: nodeIds } }, { secondNodeId: { in: nodeIds } }],
    },
    include: {
      firstNode: true,
      secondNode: true,
    },
  });

  return edges;
};

export const getEdgesByNodeId = async (
  nodeId: number,
): Promise<Edge[] | null> => {
  return prisma.edge.findMany({
    where: {
      OR: [{ firstNodeId: nodeId }, { secondNodeId: nodeId }],
    },
    include: {
      firstNode: true,
      secondNode: true,
    },
  });
};

export const postEdge = async (input: CreateEdgeInput): Promise<Edge> => {
  return prisma.edge.create({
    data: input,
    include: {
      firstNode: true,
      secondNode: true,
    },
  });
};

export const updateEdgeById = async (
  id: number,
  input: UpdateEdgeInput,
): Promise<Edge> => {
  return await prisma.edge.update({
    where: {
      id: id,
    },
    data: input,
    include: {
      firstNode: true,
      secondNode: true,
    },
  });
};

export const deleteEdgeById = async (id: number): Promise<Edge | null> => {
  return await prisma.edge.delete({
    where: {
      id: id,
    },
  });
};

export const deleteEdgesByKnowledgeFolderId = async (
  knowledgeFolderId: number,
): Promise<number> => {
  const deletedEdges = await prisma.edge.deleteMany({
    where: {
      knowledgeFolderId,
    },
  });

  return deletedEdges.count;
};

export const deleteEdgesByFolderIdAndNodeIds = async (
  knowledgeFolderId: number,
  nodeIds: number[],
): Promise<number> => {
  const deletedEdges = await prisma.edge.deleteMany({
    where: {
      knowledgeFolderId,
      OR: [{ firstNodeId: { in: nodeIds } }, { secondNodeId: { in: nodeIds } }],
    },
  });

  return deletedEdges.count;
};
