import config from "../config";
import prisma from "../prismaClient";
import { ApiError } from "../utils/apiError";

export async function createOrder(
  customerId: string,
  vendorId: string,
  items: { productId: string; quantity: number }[]
) {
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== items.length)
    throw ApiError.badRequest(`some products not found`);

  let total = 0;
  const orderItems = items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!;

    if (p.vendorId !== vendorId)
      throw ApiError.badRequest("product vendor mismatch");

    if (p.stock < i.quantity)
      throw ApiError.badRequest(`Insufficient stock for ${p.name}`);

    total += p.price * i.quantity;

    return {
      productId: p.id,
      name: p.name,
      price: p.price,
      quantity: i.quantity,
    };
  });
  const platformFee = Math.floor((total * config.PLATFORM_FEE_PERCENT) / 100);
  const vendorAmount = total - platformFee;

  const order = prisma.order.create({
    data: {
      customerId,
      vendorId,
      totalAmount: total,
      platformFee,
      vendorAmount,
      status: "PENDING",
      items: { create: orderItems },
    },
    include: { items: true },
  });

  return order;
}

export async function markPaid(
  orderId: string,
  razorpayOrderId?: string,
  razorpayPaymentId?: string
) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID", razorpayOrderId, razorpayPaymentId },
  });

  await prisma.vendor.update({
    where: { id: order.vendorId },
    data: { payoutBalance: { increment: order.vendorAmount } },
  });

  const items = await prisma.orderItem.findMany({
    where: { orderId: order.id },
  });

  await Promise.all(
    items.map((i) =>
      prisma.product.update({
        where: { id: i.productId },
        data: { stock: { decrement: i.quantity } },
      })
    )
  );

  return order;
}

export async function getOrdersForCustomer(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true, vendor: true },
  });
}

export async function getOrdersForVendor(vendorId: string) {
  return prisma.order.findMany({
    where: { vendorId },
    include: { items: true, customer: true },
  });
}
