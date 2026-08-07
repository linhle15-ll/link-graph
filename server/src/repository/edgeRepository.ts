import { prisma, Edge } from "database";
import { CreateEdgeInput } from "../types/index.js";

export const getEdge = async (id: number): Promise<Edge | null> => {
  return await prisma.edge.findUnique({
    where: {
      id: id,
    },
  });
};

export const getEdgesByFileId = async (
  fileId: number,
): Promise<Edge[] | null> => {
  return await prisma.edge.findMany({
    where: {
      knowledgeFileId: fileId,
    },
  });
};

export const getEdgesByFileIdAndNodeIds = async (
  fileId: number,
  nodeIds: number[],
): Promise<Edge[]> => {
  const edges = await prisma.edge.findMany({
    where: {
      knowledgeFileId: fileId,
      nodes: {
        every: {
          id: { in: nodeIds },
        },
      },
    },
    include: {
      nodes: true,
    },
  });

  return edges.filter((edge) => edge.nodes.length === nodeIds.length);
};

export const getEdgesByNodeId = async (
  nodeId: number,
): Promise<Edge[] | null> => {
  return prisma.edge.findMany({
    where: {
      nodes: {
        some: {
          id: nodeId,
        },
      },
    },
  });
};

export const postEdge = async (input: CreateEdgeInput): Promise<Edge> => {
  const { nodeIds, ...data } = input;

  return prisma.edge.create({
    data: {
      ...data,
      nodes: {
        connect: nodeIds.map((id) => ({ id })),
      },
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

export const deleteEdgesByKnowledgeFileId = async (
  knowledgeFileId: number,
): Promise<number> => {
  const deletedEdges = await prisma.edge.deleteMany({
    where: {
      knowledgeFileId,
    },
  });

  return deletedEdges.count;
};

export const deleteEdgesByFileIdAndNodeIds = async (
  knowledgeFileId: number,
  nodeIds: number[],
): Promise<number> => {
  const deletedEdges = await prisma.edge.deleteMany({
    where: {
      knowledgeFileId,
      nodes: {
        some: {
          id: { in: nodeIds },
        },
      },
    },
  });

  return deletedEdges.count;
};
