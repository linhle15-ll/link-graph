import { prisma, Edge } from "../utils/index.js";

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
}
