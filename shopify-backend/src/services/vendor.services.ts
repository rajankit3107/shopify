import prisma from "../prismaClient";
import { ApiError } from "../utils/apiError";

export async function createVendor(
  ownerId: string,
  payload: {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
  }
) {
  const existing = await prisma.vendor.findUnique({
    where: {
      slug: payload.slug,
    },
  });

  if (existing)
    throw ApiError.badRequest("vendor with this slug already exists");

  const vendor = await prisma.vendor.create({
    data: {
      ...payload,
      ownerId,
    },
  });

  return vendor;
}

export async function getBySlug(slug: string) {
  return prisma.vendor.findUnique({
    where: { slug },
    include: { products: true },
  });
}

export async function listAll() {
  return prisma.vendor.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}
