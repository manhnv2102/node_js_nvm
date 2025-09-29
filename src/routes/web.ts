import express, { Express } from "express";
import {
  getCreateUserPage,
  getHomePage,
  postCreateUserPage,
  postDeleteUserPage,
  getViewUserPage,
  postUpdateUserPage,
} from "controllers/user.controller";
import {
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
const router = express.Router();
const webRoutes = (app: Express) => {
  //User
  router.get("/", getHomePage);
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

  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/order", getAdminOrderPage);
  app.use("/", router);
};

export default webRoutes;
