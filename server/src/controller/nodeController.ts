import {
  asyncHandler,
  getQueryParamAsNumber,
  statuses,
} from "../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { nodeService } from "../services/index.js";
import { AppError } from "../middleware/errorHandler.js";

export const getNodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const node = await nodeService.getNodeById(Number(id));

    if (!node) {
      return next(AppError.notFound("Nodes with the given ID do not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        node,
      },
    });
  },
);

export const getNodesByFileId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeFileId = getQueryParamAsNumber(req, "knowledgeFileId", {
      required: true,
    });

    const nodes = await nodeService.getNodesByFileId(knowledgeFileId);

    if (!nodes) {
      return next(AppError.notFound("Nodes for the given file do not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        nodes,
      },
    });
  },
);

/**
 * input: link to paper
 * returns created node
 **/
export const postNode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { knowledgeFileId, link } = req.body;

    if (!knowledgeFileId || !link) {
      throw AppError.badRequest("knowledgeFileId and link are required");
    }

    const node = await nodeService.postNode(knowledgeFileId, link);

    if (!node) {
      return next(
        new AppError(
          statuses["Internal Server Error"],
          "Failed to create node",
        ),
      );
    }

    res.status(statuses.OK).json({
      data: {
        node,
      },
    });
  },
);

export const deleteNodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedNode = await nodeService.deleteNodeById(Number(id));

    if (!deletedNode) {
      return next(AppError.notFound("Nodes with the given ID do not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        deletedNode,
      },
    });
  },
);

export const deleteNodesByFileId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeFileId = getQueryParamAsNumber(req, "knowledgeFileId", {
      required: true,
    });

    const deletedNodesCount =
      await nodeService.deleteNodesByFileId(knowledgeFileId);

    if (!deletedNodesCount) {
      return next(
        AppError.notFound("Nodes with the given file ID do not exist"),
      );
    }

    res.status(statuses.OK).json({
      data: {
        deletedCount: deletedNodesCount,
      },
    });
  },
);
