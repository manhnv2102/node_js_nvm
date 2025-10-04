import express, { Express } from "express";
import {
  getCreateUserPage,
  getHomePage,
  postCreateUserPage,
  postDeleteUserPage,
  getViewUserPage,
  postUpdateUserPage,
} from "controllers/admin/user.controller";
import {
  getAdminOrderDetailPage,
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import {
  getCartPage,
  getCheckOutPage,
  getOrderHistoryPage,
  getProductPage,
  getThanksPage,
  postAddProductToCart,
  postDeleteProductCart,
  postHandleCartToCheckOut,
  postPlaceOrder,
} from "controllers/client/product.controller";
import {
  getAdminCreateProduct,
  getViewProductPage,
  postAddToCartFromDetailPage,
  postAdminCreateProduct,
  postDeleteProductPage,
  postUpdateProductPage,
} from "controllers/admin/product.controller";
import {
  getLoginPage,
  getRegisterPage,
  getSuccessRedirectPage,
  postLogout,
  postRegister,
} from "controllers/client/author.controller";
import passport from "passport";
import { isAdmin, isLogin } from "src/middleware/auth";
const router = express.Router();
const webRoutes = (app: Express) => {
  //User
  router.get("/", getHomePage);
  router.get("/success-redirect", getSuccessRedirectPage);
  router.get("/product/:id", getProductPage);
  router.get("/login", getLoginPage);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/success-redirect",
      failureRedirect: "/login",
      failureMessage: true,
    })
  );
  router.post("/logout", postLogout);
  router.get("/register", getRegisterPage);
  router.post("/register", postRegister);

  router.post("/add-product-to-cart/:id", postAddProductToCart);
  router.get("/cart", getCartPage);
  router.post("/delete-product-in-cart/:id", postDeleteProductCart);
  router.post("/handle-cart-to-checkout", postHandleCartToCheckOut);
  router.get("/checkout", getCheckOutPage);
  router.post("/place-order", postPlaceOrder);
  router.get("/tks", getThanksPage);
  router.get("/order-history", getOrderHistoryPage);
  router.post("/add-to-cart-from-detail-page/:id", postAddToCartFromDetailPage);

  //Admin
  //CRUD User
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    fileUploadMiddleware("avatar"),
    postCreateUserPage
  );
  router.get("/admin/view-user/:id", getViewUserPage);
  router.post("/admin/delete-user/:id", postDeleteUserPage);
  router.post(
    "/admin/update-user",
    fileUploadMiddleware("avatar"),
    postUpdateUserPage
  );

  //CRUD Product
  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/create-product", getAdminCreateProduct);
  router.post(
    "/admin/create-product",
    fileUploadMiddleware("image", "images/product"),
    postAdminCreateProduct
  );
  router.post("/admin/delete-product/:id", postDeleteProductPage);
  router.get("/admin/view-product/:id", getViewProductPage);
  router.post(
    "/admin/update-product",
    fileUploadMiddleware("image", "images/product"),
    postUpdateProductPage
  );

  router.get("/admin/order", getAdminOrderPage);
  router.get("/admin/order/:id", getAdminOrderDetailPage);
  app.use("/", isAdmin, router);
};

export default webRoutes;
