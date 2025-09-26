import Razorpay from "razorpay";
import config from "../config";
import crypto from "crypto";

const razor = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

type sigParams = { order_id: string; payment_id: string; signature: string };

export async function createRazorpayOrder(
  receiptOrderId: string,
  amountPaise: number
) {
  const order = razor.orders.create({
    amount: amountPaise,
    receipt: receiptOrderId,
    currency: "INR",
    payment_capture: true,
  });

  return order;
}

export async function verifySignature({
  order_id,
  payment_id,
  signature,
}: sigParams) {
  const expected = crypto
    .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

  return expected === signature;
}
