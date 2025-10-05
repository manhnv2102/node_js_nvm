import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";
import { Request, Response } from "express";

const createProduct = async (
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  imageUpload: string
) => {
  await prisma.product.create({
    data: {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      ...(imageUpload && { image: imageUpload }),
    },
  });
};

const handleViewProduct = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

const handleUpdateProduct = async (
  id: number,
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  imageUpload: string
) => {
  await prisma.product.update({
    where: { id: id },
    data: {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      ...(imageUpload !== undefined && { image: imageUpload }),
    },
  });
};

const handleDeleteProduct = async (id: number) => {
  await prisma.product.delete({ where: { id } });
};

const getProductList = async (page: number) => {
  const pageSize = TOTAL_ITEMS_PER_PAGE;
  const skip = (page - 1) * pageSize;
  return await prisma.product.findMany({
    skip: +skip,
    take: +pageSize,
  });
};

const countTotalProductPages = async () => {
  const totalItems = await prisma.product.count();
  const totalPages = Math.ceil(totalItems / TOTAL_ITEMS_PER_PAGE);
  return totalPages;
};

const getOrderHistory = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderDetails: {
        include: { products: true },
      },
    },
  });
};

export {
  createProduct,
  getProductList,
  handleDeleteProduct,
  handleViewProduct,
  handleUpdateProduct,
  getOrderHistory,
  countTotalProductPages,
};
