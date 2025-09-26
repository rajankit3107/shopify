import { NextFunction, Request, Response } from "express";
import * as vendorServices from "../services/vendor.services";
import { createVendorSchema } from "../validators/validation";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../middlewares/authmiddleware";
import { asyncHandler } from "../utils/asyncHandler";

export const createVendor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = createVendorSchema.parse(req.body);
    if (!req.user) throw { statusCode: 401, message: "Unauthorized" };
    const vendor = await vendorServices.createVendor(req.user.id, body);
    res.status(201).json(vendor);
  }
);

export const getVendor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const slug = req.params.slug;
    const vendor = await vendorServices.getBySlug(slug);
    if (!vendor) throw ApiError.notFound("vendor not found");
    return res.json(vendor);
  }
);

export const listVendors = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const vendors = await vendorServices.listAll();
    res.json(vendors);
  }
);
