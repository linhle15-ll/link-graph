import {
  asyncHandler,
  getQueryParamAsNumber,
  getQueryParamAsNumberArray,
  statuses,
} from "../../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { edgeService } from "../../services/index.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getEdgeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const edge = await edgeService.getEdgeById(Number(id));

    if (!edge) {
      return next(AppError.notFound("Edge with id does not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        edge,
      },
    });
  },
);

export const deleteEdgeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedEdge = await edgeService.deleteEdgeById(Number(id));

    if (!deletedEdge) {
      return next(AppError.notFound("Edge with id does not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        deletedEdge,
      },
    });
  },
);

export const getEdges = asyncHandler(async (req: Request, res: Response) => {
  const knowledgeFileId = getQueryParamAsNumber(req, "knowledgeFileId", {
    required: true,
  });
  const nodeIds = getQueryParamAsNumberArray(req, "nodeIds");

  const edges = nodeIds
    ? await edgeService.getEdgesByFileIdAndNodeIds(knowledgeFileId, nodeIds)
    : await edgeService.getEdgesByFileId(knowledgeFileId);

  res.status(statuses.OK).json({
    data: {
      edges,
    },
  });
});

export const postEdge = asyncHandler(async (req: Request, res: Response) => {
  const { knowledgeFileId, nodeIds, reason } = req.body;

  if (!knowledgeFileId || !nodeIds) {
    throw AppError.badRequest("knowledgeFileId and nodeIds are required");
  }

  const edge = await edgeService.postEdge(knowledgeFileId, nodeIds, reason);

  res.status(statuses.OK).json({
    data: {
      edge,
    },
  });
});

export const getEdgesByNodeId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(
        new AppError(statuses["Not Found"], "Node with id does not exist"),
      );
    }

    const edges = await edgeService.getEdgesByNodeId(Number(id));

    res.status(statuses.OK).json({
      data: {
        edges,
      },
    });
  },
);

export const deleteEdgesByKnowledgeFileId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeFileId = getQueryParamAsNumber(req, "knowledgeFileId", {
      required: true,
    });
    const nodeIds = getQueryParamAsNumberArray(req, "nodeIds");

    const deletedCount = nodeIds
      ? await edgeService.deleteEdgesByFileIdAndNodeIds(
          knowledgeFileId,
          nodeIds,
        )
      : await edgeService.deleteEdgesByKnowledgeFileId(knowledgeFileId);

    if (!deletedCount) {
      return next(
        AppError.notFound("Edges with the given file ID do not exist"),
      );
    }

    res.status(statuses.OK).json({
      data: {
        deletedCount,
      },
    });
  },
);
