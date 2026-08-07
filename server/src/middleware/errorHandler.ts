import { type Request, Response, NextFunction } from "express";
import { statuses } from "../utils/index.js";
import { config } from "../config/index.js";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    statusCode: number = statuses["Internal Server Error"],
    message: string,
    isOperational: boolean = true,
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(statuses["Not Found"], message);
  }

  static badRequest(message: string = "Bad Request"): AppError {
    return new AppError(statuses["Bad Request"], message);
  }

  static conflict(message: string = "Conflict"): AppError {
    return new AppError(statuses["Conflict"], message);
  }
}

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError
    ? err.statusCode
    : statuses["Internal Server Error"];
  const isProduction = config.environments === "production";

  const isSafeToExposeMessage = isAppError && err.isOperational;
  const message =
    isProduction && !isSafeToExposeMessage
      ? "Internal Server Error"
      : err.message;

  const response: Record<string, unknown> = {
    status: statusCode,
    message,
  };

  if (!isProduction) {
    response.stack = err.stack;
  }

  console.error("Error:", {
    status: statusCode,
    message: err.message,
    stack: err.stack,
  });

  res.status(statusCode).json(response);
};
