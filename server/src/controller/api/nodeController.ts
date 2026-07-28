import { asyncHandler, statuses } from "../../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { nodeRepository } from "../../repository/index.js";
import { nodeService } from "../../services/index.js";

export const getNodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const node = await nodeRepository.getNode(Number(id));

    res.status(statuses.OK).json({
      data: {
        node,
      },
    });
  },
);

export const getAllNodes = asyncHandler(async (req: Request, res: Response) => {
  const nodes = await nodeRepository.getAllNodes();
  res.status(statuses.OK).json({
    data: {
      nodes: nodes,
    },
  });
});

export const getNodesByFileId = asyncHandler(
  async (req: Request, res: Response) => {},
);

/**
 * input: link to paper
 * returns created node
 **/
export const postNode = asyncHandler(async (req: Request, res: Response) => {
  const node = await nodeService.postNode(req.body);
  res.status(statuses.Created).json({
    data: {
      node,
    },
  });
});

export const deleteNodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedNode = await nodeRepository.deleteNodeById(Number(id));

    res.status(statuses.OK).json({
      data: {
        deletedNode,
      },
    });
  },
);

export const deleteAllNodes = asyncHandler(
  async (req: Request, res: Response) => {},
);
