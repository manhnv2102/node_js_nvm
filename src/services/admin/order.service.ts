import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const getOrderAdmin = async (page: number) => {
  const pageSize = TOTAL_ITEMS_PER_PAGE;
  const skip = (page - 1) * pageSize;
  return await prisma.order.findMany({
    include: { user: true },
    skip: +skip,
    take: +pageSize,
  });
};

const countTotalOrderPages = async () => {
  const totalItems = await prisma.order.count();
  const totalPages = Math.ceil(totalItems / TOTAL_ITEMS_PER_PAGE);
  return totalPages;
};
const getOrderDetailAdmin = async (orderId: number) => {
  return await prisma.orderDetail.findMany({
    where: { orderId },
    include: { products: true },
  });
};

export { getOrderAdmin, getOrderDetailAdmin, countTotalOrderPages };
