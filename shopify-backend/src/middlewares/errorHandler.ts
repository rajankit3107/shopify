import { Request, Response, NextFunction } from "express";
import config from "../config";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err?.statusCode ?? 500;
  const body: any = { error: err?.message ?? "Internal Server Error" };
  if (config.NODE_ENV !== "production" && err?.stack) body.stack = err.stack;
  console.error(err);
  res.status(status).json(body);
}
