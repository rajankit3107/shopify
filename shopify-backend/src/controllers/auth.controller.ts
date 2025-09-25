import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authservice from "../services/auth.services";
import { loginSchema, signupSchema } from "../validators/validation";
import { ApiError } from "../utils/apiError";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const body = signupSchema.safeParse(req.body);
  if (!body.success) throw ApiError.badRequest("Invalid credentials");

  const { email, password, role } = req.body;

  const user = await authservice.signup(email, password, role);

  return res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.safeParse(req.body);
  //   console.log(body);
  if (!body.success) throw ApiError.badRequest("Invalid credentials");
  //   console.log(body.success);

  const { email, password } = req.body;

  const payload = await authservice.login(email, password);

  return res.status(200).json(payload);
});
