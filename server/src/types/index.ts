import { type Request, Response, NextFunction, Router } from "express";

export type CreateNodeInput = {
  title: string;
  knowledgeFolderId: number;
  authors?: string[];
  source?: string;
  contentSummary?: string;
  link: string;
  posX?: number;
  posY?: number;
  isOnGraph?: boolean;
};

export type UpdateNodeInput = {
  title?: string;
  contentSummary?: string;
  posX?: number;
  posY?: number;
  isOnGraph?: boolean;
};

export type CreateEdgeInput = {
  knowledgeFolderId: number;
  firstNodeId: number;
  secondNodeId: number;
  label?: string;
  reasoning?: string;
  score?: number;
};

export type UpdateEdgeInput = {
  label?: string;
  reasoning?: string;
  score?: number;
};

export type CreateKnowledgeFolderInput = {
  title: string;
  description?: string;
  color?: string;
  userId: number;
};

export interface CustomRequest extends Request {
  isWebError: boolean;
  userId: number;
}

export interface RequestBody {
  link: string;
  knowledgeFolderId: number;
}

export type AsyncHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type QueryParamOptions = { required?: boolean };

export type Route = { path: string; route: Router };

export type ScrapedNodeMetaData = {
  title: string;
  authors?: string[];
  source?: string;
  contentSummary?: string;
};

export type Compactable<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export function compact<T extends object>(obj: T): Compactable<T> {
  const result = {} as Compactable<T>;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}
