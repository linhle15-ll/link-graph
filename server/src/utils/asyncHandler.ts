import { type Request, Response, NextFunction } from "express";
import { AsyncHandlerFn } from "../types/index.js";

const asyncHandler =
  (fn: AsyncHandlerFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export { asyncHandler };
