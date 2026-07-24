import { Edge, Node } from "../generated/prisma/client.js";
import { prisma } from "../utils/index.js";

export class NodeRepository {
  public async getNode(id: number): Promise<Node | null> {
    return await prisma.node.findUnique({
      where: {
        id: id,
      },
    });
  }

  public async getNodes(ids: number[]): Promise<Node[] | null> {
    return await prisma.node.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  public async getNodesByFileId(fileId: number): Promise<Node[] | null> {
    return await prisma.node.findMany({
      where: {
        fileId: fileId,
      },
    });
  }

  public async createTestNode(
    title: string,
    authors: string[],
    source: string,
    fileId: number,
  ): Promise<number> {
    const node = await prisma.node.create({
      data: {
        title: title,
        authors: authors,
        source: source,
        fileId: fileId,
      },
    });
    return node.id;
  }
}
