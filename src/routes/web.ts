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
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import { getProductPage } from "controllers/client/product.controller";
import {
  getAdminCreateProduct,
  getViewProductPage,
  postAdminCreateProduct,
  postDeleteProductPage,
  postUpdateProductPage,
} from "controllers/admin/product.controller";
import {
  getLoginPage,
  getRegisterPage,
  postRegister,
} from "controllers/client/author.controller";
import passport from "passport";
const router = express.Router();
const webRoutes = (app: Express) => {
  //User
  router.get("/", getHomePage);
  router.get("/product/:id", getProductPage);
  router.get("/login", getLoginPage);

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureMessage: true,
    })
  );

  router.get("/register", getRegisterPage);
  router.post("/register", postRegister);

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
  app.use("/", router);
};

export default webRoutes;
