import { Request, Response } from "express";
import {
  addProductToCart,
  deleteProductInCart,
  displayProductsToCart,
  getProductByID,
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
  return res.render("client/products/cart.ejs", {
    cartDetails,
    totalPrice,
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

export {
  getProductPage,
  postAddProductToCart,
  getCartPage,
  postDeleteProductCart,
};
