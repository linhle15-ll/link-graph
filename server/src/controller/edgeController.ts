import {
  asyncHandler,
  getQueryParamAsNumber,
  getQueryParamAsNumberArray,
  statuses,
} from "../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { edgeService } from "../services/index.js";
import { AppError } from "../middleware/errorHandler.js";

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
  const knowledgeFolderId = getQueryParamAsNumber(req, "knowledgeFolderId", {
    required: true,
  });
  const nodeIds = getQueryParamAsNumberArray(req, "nodeIds");

  const edges = nodeIds
    ? await edgeService.getEdgesByFolderIdAndNodeIds(knowledgeFolderId, nodeIds)
    : await edgeService.getEdgesByFolderId(knowledgeFolderId);

  res.status(statuses.OK).json({
    data: {
      edges,
    },
  });
});

export const postEdge = asyncHandler(async (req: Request, res: Response) => {
  const {
    knowledgeFolderId,
    firstNodeId,
    secondNodeId,
    label,
    reasoning,
    score,
  } = req.body;

  if (!knowledgeFolderId || !firstNodeId || !secondNodeId) {
    throw AppError.badRequest(
      "knowledgeFolderId, firstNodeId, and secondNodeId are required",
    );
  }

  const edge = await edgeService.postEdge({
    knowledgeFolderId,
    firstNodeId,
    secondNodeId,
    label,
    reasoning,
    score,
  });

  res.status(statuses.OK).json({
    data: {
      edge,
    },
  });
});

export const updateEdgeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { label, reasoning, score } = req.body;

    const updatedEdge = await edgeService.updateEdgeById(Number(id), {
      label,
      reasoning,
      score,
    });

    if (!updatedEdge) {
      return next(AppError.notFound("Edge with id does not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        edge: updatedEdge,
      },
    });
  },
);

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

export const deleteEdgesByKnowledgeFolderId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeFolderId = getQueryParamAsNumber(req, "knowledgeFolderId", {
      required: true,
    });
    const nodeIds = getQueryParamAsNumberArray(req, "nodeIds");

    const deletedCount = nodeIds
      ? await edgeService.deleteEdgesByFolderIdAndNodeIds(
          knowledgeFolderId,
          nodeIds,
        )
      : await edgeService.deleteEdgesByKnowledgeFolderId(knowledgeFolderId);

    if (!deletedCount) {
      return next(
        AppError.notFound("Edges with the given folder ID do not exist"),
      );
    }

    res.status(statuses.OK).json({
      data: {
        deletedCount,
      },
    });
  },
);
