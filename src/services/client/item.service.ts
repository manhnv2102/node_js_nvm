import { prisma } from "config/client";

const getProduct = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const getProductByID = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id: +id } });
  return product;
};

export { getProduct, getProductByID };
