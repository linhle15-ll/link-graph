import { type Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/index.js";

// TODO: bearer token validation
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  (req as CustomRequest).userId = 1;
  next();
};
