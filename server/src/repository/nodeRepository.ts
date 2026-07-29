import { prisma, compact, Edge, Node } from "../utils/index.js";
import { CreateNodeInput } from "../types/index.js";

export class NodeRepository {
  public async getNode(id: number): Promise<Node | null> {
    return await prisma.node.findUnique({
      where: {
        id: id,
      },
    });
  }

  public async getAllNodes(): Promise<Node[] | null> {
    return await prisma.node.findMany();
  }

  /**
   *
   * @param ids of nodes you want to get
   * @returns those nodes
   */
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
        knowledgeFileId: fileId,
      },
    });
  }

  public async deleteNodeById(id: number): Promise<Node> {
    const deletedNode = await prisma.node.delete({
      where: {
        id: id,
      },
    });
    return deletedNode;
  }

  public async postNode(input: CreateNodeInput): Promise<Node> {
    const node = await prisma.node.create({
      data: compact({
        title: input.title,
        authors: input.authors,
        source: input.source,
        contentSummary: input.contentSummary,
        link: input.link,
        knowledgeFileId: input.knowledgeFileId,
      }),
    });
    return node;
  }
}
