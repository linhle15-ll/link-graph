import { type Request } from "express";
import { AppError } from "../middleware/errorHandler.js";
import { QueryParamOptions } from "../types/index.js";

export function getQueryParamAsNumber(
  req: Request,
  key: string,
  options: { required: true },
): number;
export function getQueryParamAsNumber(
  req: Request,
  key: string,
  options?: QueryParamOptions,
): number | undefined;
export function getQueryParamAsNumber(
  req: Request,
  key: string,
  options: QueryParamOptions = {},
): number | undefined {
  const raw = req.query[key];

  if (raw === undefined) {
    if (options.required) {
      throw AppError.badRequest(`Query parameter "${key}" is required`);
    }
    return undefined;
  }

  if (typeof raw !== "string") {
    throw AppError.badRequest(
      `Query parameter "${key}" must be a single value`,
    );
  }

  const value = Number(raw);
  if (Number.isNaN(value)) {
    throw AppError.badRequest(`Query parameter "${key}" must be a number`);
  }

  return value;
}

export function getQueryParamAsNumberArray(
  req: Request,
  key: string,
  options: { required: true },
): number[];
export function getQueryParamAsNumberArray(
  req: Request,
  key: string,
  options?: QueryParamOptions,
): number[] | undefined;
export function getQueryParamAsNumberArray(
  req: Request,
  key: string,
  options: QueryParamOptions = {},
): number[] | undefined {
  const raw = req.query[key];

  if (raw === undefined) {
    if (options.required) {
      throw AppError.badRequest(`Query parameter "${key}" is required`);
    }
    return undefined;
  }

  const rawValues = Array.isArray(raw) ? raw : [raw];

  return rawValues.flatMap((value) => {
    if (typeof value !== "string") {
      throw AppError.badRequest(
        `Query parameter "${key}" must be a list of numbers`,
      );
    }

    return value.split(",").map((item) => {
      const numberValue = Number(item);
      if (Number.isNaN(numberValue)) {
        throw AppError.badRequest(
          `Query parameter "${key}" must be a list of numbers`,
        );
      }
      return numberValue;
    });
  });
}

export function getQueryParamAsString(
  req: Request,
  key: string,
  options: { required: true },
): string;
export function getQueryParamAsString(
  req: Request,
  key: string,
  options?: QueryParamOptions,
): string | undefined;
export function getQueryParamAsString(
  req: Request,
  key: string,
  options: QueryParamOptions = {},
): string | undefined {
  const raw = req.query[key];

  if (raw === undefined) {
    if (options.required) {
      throw AppError.badRequest(`Query parameter "${key}" is required`);
    }
    return undefined;
  }

  if (typeof raw !== "string") {
    throw AppError.badRequest(
      `Query parameter "${key}" must be a single value`,
    );
  }

  return raw;
}
