import { prisma } from "config/client";

const getProduct = async () => {
  const products = await prisma.product.findMany();
  return products;
};

const getProductByID = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id: +id } });
  return product;
};

const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (cart) {
    //update
    //Cập nhật sum giỏ hàng
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: { increment: quantity },
      },
    });

    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    //Cập nhật cart-detail
    //Nếu chưa có, tạo mới. Có rồi, cập nhật quantity
    await prisma.cartDetail.upsert({
      where: {
        id: currentCartDetail?.id ?? 0,
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        price: product.price,
        quantity: quantity,
        productId: product.id,
        cartId: cart.id,
      },
    });
  } else {
    //create(carts + cartDetails)
    await prisma.cart.create({
      data: {
        sum: quantity,
        userId: user.id,
        cartDetails: {
          create: [
            {
              price: product.price,
              quantity: quantity,
              productId: product.id,
            },
          ],
        },
      },
    });
  }
};

const displayProductsToCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return []; // nhớ check kỹ null

  const currentCartDetail = await prisma.cartDetail.findMany({
    where: { cartId: cart.id }, // bây giờ cart.id đã chắc chắn có
    include: { product: true },
  });

  return currentCartDetail;
};

const deleteProductInCart = async (cartDetailId: number, userId: number) => {
  const x = await prisma.cartDetail.findFirst({
    where: { id: cartDetailId },
    select: { cartId: true, quantity: true },
  });

  if (!x) return;

  await prisma.cartDetail.delete({
    where: { id: cartDetailId },
  });

  const remaining = await prisma.cartDetail.count({
    where: { cartId: x.cartId },
  });

  if (remaining === 0) {
    // 4a) Không còn dòng nào -> xóa luôn giỏ
    await prisma.cart.delete({ where: { userId } });
  } else {
    // 4b) Còn dòng -> cập nhật sum
    // Nếu sum = tổng SỐ LƯỢNG sản phẩm, nên trừ theo quantity của dòng vừa xóa
    await prisma.cart.update({
      where: { userId },
      data: {
        sum: { decrement: x.quantity }, // nếu sum là tổng số MẶT HÀNG (số dòng) thì decrement: 1
      },
    });
  }
};

export {
  getProduct,
  getProductByID,
  addProductToCart,
  displayProductsToCart,
  deleteProductInCart,
};
