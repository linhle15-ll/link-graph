import { asyncHandler, statuses } from "../../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { nodeRepository } from "../../repository/index.js";

export const getAllNodes = asyncHandler(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const nodes = await nodeRepository.getNodesByFileId(Number(fileId));

  // next func here for middleware
  res.status(statuses.OK).json({
    data: {
      nodes: nodes,
    },
  });
});

export const getNode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const node = await nodeRepository.getNode(Number(id));

  // next func here for middleware
  res.status(statuses.OK).json({
    data: {
      nodes: node,
    },
  });
});
