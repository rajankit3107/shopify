import { Response } from "express";
import { AuthRequest } from "../middlewares/authmiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { createProductSchema } from "../validators/validation";
import { ApiError } from "../utils/apiError";
import * as productServices from "../services/product.services";
import prisma from "../prismaClient";

export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = createProductSchema.safeParse(req.body);

    if (!body.success) throw ApiError.badRequest("invalid data");

    const vendor = await prisma.vendor.findUnique({
      where: { ownerId: req.user?.id },
    });

    if (!vendor) throw ApiError.unauthorized("Unauthorized");

    const product = await productServices.create(vendor.id, body.data);

    return res.status(201).json(product);
  }
);

export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    const body = createProductSchema.partial().parse(req.body);
    if (!req.user) throw ApiError.unauthorized("Unauthorized");

    const vendor = await prisma.vendor.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!vendor) throw ApiError.unauthorized("No vendor for this user");
    const updatedProduct = await productServices.update(id, vendor.id, body);

    return res.json(updatedProduct);
  }
);

export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    if (!req.user) throw ApiError.unauthorized("Unauthorized");

    const vendor = await prisma.vendor.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!vendor) throw ApiError.forbidden("Forbidden");

    await productServices.remove(id, vendor.id);
  }
);

export const getProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id;

    const product = await productServices.getById(id);

    if (!product) throw ApiError.notFound("Product not found");

    return res.json(product);
  }
);

export const listProducts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const products = await productServices.listAll();

    return res.json(products);
  }
);
