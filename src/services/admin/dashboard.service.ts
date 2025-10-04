import { prisma } from "config/client";

const getDashBoardInfor = async () => {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const orders = await prisma.order.count();

  return { users, products, orders };
};

export { getDashBoardInfor };
