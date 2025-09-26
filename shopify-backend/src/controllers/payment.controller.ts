import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as PaymenetService from "../services/payment.services";
import * as orderServices from "../services/order.services";
import { ApiError } from "../utils/apiError";

export const callback = asyncHandler(async (req: Request, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    receipt,
  } = req.body;

  const success = PaymenetService.verifySignature({
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!success) throw ApiError.badRequest("Invalid signature");

  await orderServices.markPaid(receipt, razorpay_order_id, razorpay_payment_id);

  return res.status(200).json({ ok: true });
});

export const webhook = asyncHandler(async (req: Request, res: Response) => {
  // Implement verification using webhook secret if configured in Razorpay
  res.json({ ok: true });
});
