import { asyncHandler, statuses } from "../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { knowledgeFolderService } from "../services/index.js";
import { CustomRequest } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export const getAllKnowledgeFolders = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req as CustomRequest;

    const folders =
      await knowledgeFolderService.getKnowledgeFoldersByUserId(userId);

    res.status(statuses.OK).json({
      data: {
        folders: folders ?? [],
      },
    });
  },
);

export const postKnowledgeFolder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as CustomRequest;
    const { title, description, color } = req.body;

    if (!title) {
      throw AppError.badRequest("title is required");
    }

    const folder = await knowledgeFolderService.postKnowledgeFolder({
      title,
      description,
      color,
      userId,
    });

    if (!folder) {
      return next(
        new AppError(
          statuses["Internal Server Error"],
          "Failed to create knowledge folder",
        ),
      );
    }

    res.status(statuses.OK).json({
      data: {
        folder,
      },
    });
  },
);

export const deleteKnowledgeFolderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedFolder =
      await knowledgeFolderService.deleteKnowledgeFolderById(Number(id));

    if (!deletedFolder) {
      return next(AppError.notFound("Folder with the given ID does not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        deletedFolder,
      },
    });
  },
);

export const getKnowledgeFolderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const folder = await knowledgeFolderService.getKnowledgeFolderById(
      Number(id),
    );

    if (!folder) {
      return next(AppError.notFound("Folder with the given ID does not exist"));
    }
    res.status(statuses.OK).json({
      data: {
        folder,
      },
    });
  },
);

export const deleteKnowledgeFoldersByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as CustomRequest;

    const deletedFoldersCount =
      await knowledgeFolderService.deleteKnowledgeFoldersByUserId(userId);

    if (!deletedFoldersCount) {
      return next(
        AppError.notFound("Folders with the given user ID do not exist"),
      );
    }

    res.status(statuses.OK).json({
      data: {
        deletedCount: deletedFoldersCount,
      },
    });
  },
);
