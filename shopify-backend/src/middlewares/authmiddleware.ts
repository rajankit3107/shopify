import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import config from "../config";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer "))
    return next(ApiError.unauthorized(`Unauthorized`));

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as any;
    req.user = {
      id: payload.sub ?? payload.id,
      role: payload.role ?? payload.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: `Invalid token` });
  }
}
