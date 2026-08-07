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
      return next(AppError.notFound("Node with the given ID does not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        node,
      },
    });
  },
);

export const getNodesByFolderId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeFolderId = getQueryParamAsNumber(req, "knowledgeFolderId", {
      required: true,
    });

    const nodes = await nodeService.getNodesByFolderId(knowledgeFolderId);

    if (!nodes) {
      return next(AppError.notFound("Nodes for the given folder do not exist"));
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
    const { knowledgeFolderId, link, title, posX, posY, isOnGraph } = req.body;

    if (!knowledgeFolderId || !link || !title) {
      throw AppError.badRequest(
        "knowledgeFolderId, link, and title are required",
      );
    }

    const node = await nodeService.postNode({
      knowledgeFolderId,
      link,
      title,
      posX,
      posY,
      isOnGraph,
    });

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

export const updateNodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, contentSummary, posX, posY, isOnGraph } = req.body;

    const updatedNode = await nodeService.updateNodeById(Number(id), {
      title,
      contentSummary,
      posX,
      posY,
      isOnGraph,
    });

    if (!updatedNode) {
      return next(AppError.notFound("Node with the given ID does not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        node: updatedNode,
      },
    });
  },
);

export const deleteNodeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedNode = await nodeService.deleteNodeById(Number(id));

    if (!deletedNode) {
      return next(AppError.notFound("Node with the given ID does not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        deletedNode,
      },
    });
  },
);

export const deleteNodesByFolderId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const knowledgeFolderId = getQueryParamAsNumber(req, "knowledgeFolderId", {
      required: true,
    });

    const deletedNodesCount =
      await nodeService.deleteNodesByFolderId(knowledgeFolderId);

    if (!deletedNodesCount) {
      return next(
        AppError.notFound("Nodes with the given folder ID do not exist"),
      );
    }

    res.status(statuses.OK).json({
      data: {
        deletedCount: deletedNodesCount,
      },
    });
  },
);
