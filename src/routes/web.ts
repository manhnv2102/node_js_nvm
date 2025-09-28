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
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const webRoutes = (app: Express) => {
  //User
  router.get("/", getHomePage);
  router.post("/handle-delete-user/:id", postDeleteUserPage);
  router.get("/handle-view-user/:id", getViewUserPage);
  router.post("/handle-update-user", postUpdateUserPage);
  //Admin
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);
  // router.post("/admin/handle-create-user", postCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    upload.single("avatar"),
    (req, res) => {
      return res.send("ok");
    }
  );

  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/order", getAdminOrderPage);
  app.use("/", router);
};

export default webRoutes;
