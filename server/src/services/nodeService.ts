import { Node } from "../utils/index.js";
import { nodeRepository } from "../repository/index.js";
import { CreateNodeInput } from "../types/index.js";

interface RequestBody {
  link: string;
}

export class NodeService {
  public async postNode(body: RequestBody): Promise<Node> {
    // const summary = await summaryFunc
    // const title = await func

    const link = body.link;

    const input: CreateNodeInput = {
      title: "test title",
      knowledgeFileId: 2,
      link: link,
    };
    const node = await nodeRepository.postNode(input);
    return node;
  }
}

export const nodeService = new NodeService();
