import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authmiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { createOrderSchema } from "../validators/validation";
import { ApiError } from "../utils/apiError";
import * as orderServices from "../services/order.services";
import * as paymentServices from "../services/payment.services";
import prisma from "../prismaClient";

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
    const razorOrder = await paymentServices.createRazorpayOrder(
      order.id,
      order.totalAmount
    );
    
    // Add key_id to the response
    const config = require("../config").default;
    const razorpayResponse = {
      ...razorOrder,
      key_id: config.RAZORPAY_KEY_ID 
    };

    return res.status(201).json({ order, razorpay: razorpayResponse });
  }
);

export const markPaid = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    req.body;
  const verified = paymentServices.verifySignature({
    order_id: razorpayOrderId,
    payment_id: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!verified) throw ApiError.badRequest("Invalid signature");

  await orderServices.markPaid(orderId, razorpayOrderId, razorpayPaymentId);

  return res.status(200).json({ ok: true });
});

export const myOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError.unauthorized(`Unauthorized`);

    const orders = await orderServices.getOrdersForCustomer(req.user.id);

    return res.json(orders);
  }
);

export const vendorOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError.unauthorized(`Unauthorized`);

    const vendor = await prisma.vendor.findUnique({
      where: { ownerId: req.user.id },
    });

    if (!vendor) throw ApiError.notFound(`No vendor with this id is available`);

    const orders = await orderServices.getOrdersForVendor(vendor.id);

    return res.json(orders);
  }
);
