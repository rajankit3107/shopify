import { Response } from "express";
import { AuthRequest } from "../middlewares/authmiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderSchema } from "../validators/validation";
import { ApiError } from "../utils/apiError";
import * as orderServices from "../services/order.services";

export const createorder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = createOrderSchema.safeParse(req.body);

    if (!body.success) throw ApiError.badRequest("invalid data received");

    if (!req.user) throw ApiError.unauthorized(`Unauthorized`);

    const order = await orderServices.createOrder(
      req.user.id,
      body.data.vendorId,
      body.data.items
    );
  }
);
