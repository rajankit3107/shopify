import { NextFunction, Request, Response } from "express";
import * as vendorServices from "../services/vendor.services";
import { createVendorSchema } from "../validators/validation";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../middlewares/authmiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../prismaClient";

export const createVendor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = createVendorSchema.parse(req.body);
    if (!req.user) throw { statusCode: 401, message: "Unauthorized" };
    const vendor = await vendorServices.createVendor(req.user.id, body);
    res.status(201).json(vendor);
  }
);

export const getVendor = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const vendor = await vendorServices.getBySlug(slug);
  if (!vendor) throw ApiError.notFound("vendor not found");
  return res.json(vendor);
});

export const listVendors = asyncHandler(async (req: Request, res: Response) => {
  const vendors = await vendorServices.listAll();
  res.json(vendors);
});

export const getVendorMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError.unauthorized("Unauthorized");

    const vendor = await prisma.vendor.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!vendor) throw ApiError.notFound("Vendor not found");

    res.json(vendor);
  }
);
