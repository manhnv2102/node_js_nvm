import { Request, Response } from "express";
import { getOrderHistory } from "services/admin/product.service";
import {
  addProductToCart,
  deleteProductInCart,
  displayProductsToCart,
  getProductByID,
  handlePlaceOrder,
  updateCartDetailBeforeCheckOut,
} from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductByID(id);
  return res.render("client/products/detail.ejs", {
    product,
  });
};
const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (user) {
    await addProductToCart(1, +id, user);
  } else {
    return res.redirect("/login");
  }
  return res.redirect("/");
};

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const cartDetails = await displayProductsToCart(+user.id);

  const totalPrice = cartDetails
    ?.map((item) => +item.price * +item.quantity)
    ?.reduce((a, b) => a + b, 0);

  const cartId = cartDetails.length ? cartDetails[0].cartId : 0;
  return res.render("client/products/cart.ejs", {
    cartDetails,
    totalPrice,
    cartId,
  });
};

const postDeleteProductCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  console.log(">>>>user: ", user);
  if (user) {
    await deleteProductInCart(+id, user.id);
  } else {
    return res.redirect("/login");
  }

  return res.redirect("/cart");
};

const getCheckOutPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const cartDetails = await displayProductsToCart(+user.id);

  const totalPrice = cartDetails
    ?.map((item) => +item.price * +item.quantity)
    ?.reduce((a, b) => a + b, 0);
  return res.render("client/products/checkout.ejs", {
    cartDetails,
    totalPrice,
  });
};
const postHandleCartToCheckOut = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const { cartId } = req.body;
  const currentCartDetail: { id: string; quantity: string }[] =
    req.body?.cartDetails ?? [];
  await updateCartDetailBeforeCheckOut(currentCartDetail, cartId);

  return res.redirect("/checkout");
};
const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body;

  const message = await handlePlaceOrder(
    user.id,
    receiverName,
    receiverAddress,
    receiverPhone,
    +totalPrice
  );
  if (message) res.redirect("/checkout");
  return res.redirect("/tks");
};
const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  return res.render("client/products/thanks.ejs");
};
const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const orders = await getOrderHistory(user.id);

  return res.render("client/products/order.history.ejs", {
    orders,
  });
};

export {
  getProductPage,
  postAddProductToCart,
  getCartPage,
  postDeleteProductCart,
  getCheckOutPage,
  postHandleCartToCheckOut,
  postPlaceOrder,
  getThanksPage,
  getOrderHistoryPage,
};
