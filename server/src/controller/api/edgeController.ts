import { asyncHandler, statuses } from "../../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { edgeRepository } from "../../repository/index.js";

export const getEdge = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const edge = await edgeRepository.getEdge(Number(id));

  // next func here for middleware
  res.status(statuses.OK).json({
    data: {
      edges: edge,
    },
  });
});

export const getAllEdges = asyncHandler(async (req: Request, res: Response) => {
  const { nodeId } = req.params;

  const edges = await edgeRepository.getEdgesByNodeId(Number(nodeId));

  // next func here for middleware
  res.status(statuses.OK).json({
    data: {
      edges: edges,
    },
  });
});
