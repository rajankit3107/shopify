import z, { email } from "zod";

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const createVendorSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative().default(0),
  imageUrl: z.url().optional(),
});

export const createOrderSchema = z.object({
  vendorId: z.cuid(),
  items: z
    .array(z.object({ productId: z.cuid(), quantity: z.number().int().min(1) }))
    .min(1),
});
