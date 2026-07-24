import { Edge } from "../generated/prisma/client.js";
import { prisma } from "../utils/index.js";

export class EdgeRepository {
  public async getEdge(id: number): Promise<Edge | null> {
    return await prisma.edge.findUnique({
      where: {
        id: id,
      },
    });
  }

  public async getEdgesByNodeId(id: number): Promise<Edge[] | null> {
    return await prisma.edge.findMany({
      where: {
        nodes: {
          some: {
            id: id,
          },
        },
      },
    });
  }

  public async createTestEdge(
    score: number,
    explanation: string,
    node1: number,
    node2: number,
  ): Promise<void> {
    await prisma.edge.create({
      data: {
        score: score,
        explanation: explanation,
        nodes: {
          connect: [
            {
              id: node1,
            },
            {
              id: node2,
            },
          ],
        },
      },
    });
  }
}
