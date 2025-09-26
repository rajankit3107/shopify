import { tr } from "zod/v4/locales";
import prisma from "../prismaClient";
import { ApiError } from "../utils/apiError";

export async function create(
  vendorId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
  }
) {
  return prisma.product.create({ data: { ...data, vendorId } });
}

export async function update(
  productId: string,
  vendorId: string,
  updates: any
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound("Product Not Found");

  if (product.vendorId !== vendorId) throw ApiError.forbidden("Forbidden");

  return prisma.product.update({ where: { id: productId }, data: updates });
}

export async function remove(productId: string, vendorId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound("product not found");

  if (product.vendorId !== vendorId) throw ApiError.forbidden("Forbidden");

  return prisma.product.delete({ where: { id: productId } });
}

export async function getById(id: string) {
  return prisma.product.findUnique({
    where: { id: id },
    include: { vendor: true },
  });
}

export async function listAll() {
  return prisma.product.findMany({ include: { vendor: true } });
}
