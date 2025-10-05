import { prisma } from "config/client";

const getProduct = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    skip: +skip,
    take: +pageSize,
  });
  return products;
};
const countTotalProductClientPage = async (pageSize: number) => {
  const totalItems = await prisma.product.count();
  const totalPages = Math.ceil(totalItems / pageSize);
  return totalPages;
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

const updateCartDetailBeforeCheckOut = async (
  data: { id: string; quantity: string }[],
  cartId: string
) => {
  let quantity = 0;
  for (let i = 0; i < data.length; i++) {
    quantity += +data[i].quantity;
    await prisma.cartDetail.update({
      where: { id: +data[i].id },
      data: {
        quantity: +data[i].quantity,
      },
    });
  }

  await prisma.cart.update({
    where: {
      id: +cartId,
    },
    data: {
      sum: quantity,
    },
  });
};
const handlePlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number
) => {
  try {
    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          cartDetails: true,
        },
      });

      if (cart) {
        const dataOrderDetail =
          cart?.cartDetails?.map((item) => ({
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
          })) ?? [];
        await tx.order.create({
          data: {
            receiverName,
            receiverAddress,
            receiverPhone,
            paymentMethod: "COD",
            paymentStatus: "PAYMENT_UNPAID",
            status: "PENDING",
            totalPrice: totalPrice,
            userId,
            orderDetails: {
              create: dataOrderDetail,
            },
          },
        });

        //remove cart-detail + cart
        await tx.cartDetail.deleteMany({
          where: { cartId: cart.id },
        });

        await tx.cart.delete({
          where: { id: cart.id },
        });

        for (let i = 0; i < cart.cartDetails.length; i++) {
          const productId = cart.cartDetails[i].productId;
          const product = await tx.product.findUnique({
            where: { id: productId },
          });

          if (!product || product.quantity < cart.cartDetails[i].quantity) {
            throw Error(
              `Sản phẩm ${product?.name} không tồn tại hoặc không đủ số lượng`
            );
          }

          await tx.product.update({
            where: { id: productId },
            data: {
              quantity: { decrement: cart.cartDetails[i].quantity },
              sold: { increment: cart.cartDetails[i].quantity },
            },
          });
        }
      }
    });

    return "";
  } catch (error) {
    return error.message;
  }
};

export {
  getProduct,
  getProductByID,
  addProductToCart,
  displayProductsToCart,
  deleteProductInCart,
  updateCartDetailBeforeCheckOut,
  handlePlaceOrder,
  countTotalProductClientPage,
};
