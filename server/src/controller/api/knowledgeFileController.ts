import { asyncHandler, statuses } from "../../utils/index.js";
import { type Request, Response, NextFunction } from "express";
import { knowledgeFileService } from "../../services/index.js";
import { CustomRequest } from "../../types/index.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getAllKnowledgeFiles = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req as CustomRequest;

    const files = await knowledgeFileService.getKnowledgeFilesByUserId(userId);

    res.status(statuses.OK).json({
      data: {
        files: files ?? [],
      },
    });
  },
);

export const postKnowledgeFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as CustomRequest;
    const { title, description } = req.body;

    if (!title) {
      throw AppError.badRequest("title is required");
    }

    const file = await knowledgeFileService.postKnowledgeFile({
      title,
      description,
      userId,
    });

    if (!file) {
      return next(
        new AppError(
          statuses["Internal Server Error"],
          "Failed to create knowledge file",
        ),
      );
    }

    res.status(statuses.OK).json({
      data: {
        file,
      },
    });
  },
);

export const deleteKnowledgeFileById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedFile = await knowledgeFileService.deleteKnowledgeFileById(
      Number(id),
    );

    if (!deletedFile) {
      return next(AppError.notFound("File with the given ID do not exist"));
    }

    res.status(statuses.OK).json({
      data: {
        deletedFile,
      },
    });
  },
);

export const getKnowledgeFileById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const file = await knowledgeFileService.getKnowledgeFileById(Number(id));

    if (!file) {
      return next(AppError.notFound("File with the given ID do not exist"));
    }
    res.status(statuses.OK).json({
      data: {
        file,
      },
    });
  },
);

export const deleteKnowledgeFilesByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req as CustomRequest;

    const deletedFilesCount =
      await knowledgeFileService.deleteKnowledgeFilesByUserId(userId);

    if (!deletedFilesCount) {
      return next(
        AppError.notFound("Files with the given user ID do not exist"),
      );
    }

    res.status(statuses.OK).json({
      data: {
        deletedCount: deletedFilesCount,
      },
    });
  },
);
