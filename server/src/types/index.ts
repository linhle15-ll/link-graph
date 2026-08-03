import { type Request, Response, NextFunction, Router } from "express";

export type CreateNodeInput = {
  title: string;
  knowledgeFileId: number;
  authors?: string[];
  source?: string;
  contentSummary?: string;
  link: string;
};

export type CreateEdgeInput = {
  knowledgeFileId: number;
  nodeIds: number[];
  score: number;
  reason?: string;
};

export type CreateKnowledgeFileInput = {
  title: string;
  description?: string;
  userId: number;
};

export interface CustomRequest extends Request {
  isWebError: boolean;
  userId: number;
}

export interface RequestBody {
  link: string;
  knowledgeFileId: number;
}

export type AsyncHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type QueryParamOptions = { required?: boolean };

export type Route = { path: string; route: Router };

export type ExtractedNodeMetadata = {
  title: string;
  authors?: string[];
  source?: string;
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
