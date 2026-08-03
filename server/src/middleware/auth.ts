import { type Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/index.js";

// stub - token validation not implemented yet
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  (req as CustomRequest).userId = 1;
  next();
};
