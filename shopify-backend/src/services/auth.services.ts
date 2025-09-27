import config from "../config";
import prisma from "../prismaClient";
import { ApiError } from "../utils/apiError";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

export async function signup(
  email: string,
  password: string,
  role: "CUSTOMER" | "VENDOR"
) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) throw ApiError.badRequest("username already taken");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  

  if (!user) throw ApiError.badRequest(`Invalid credentials`);

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) throw ApiError.badRequest("Invalid credentials");

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY } as SignOptions
  );

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}
