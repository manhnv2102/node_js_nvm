import { Request, Response } from "express";
import { getProduct } from "services/client/item.service";
import {
  handleCreateUser,
  handleDeleteUser,
  handleViewUser,
  handleUpdateUser,
  getAllRoles,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  const products = await getProduct();
  const user = req.user;
  console.log(">>>>current user:", user);
  return res.render("client/home/show.ejs", {
    products,
  });
};
const getCreateUserPage = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  return res.render("admin/user/create.ejs", {
    roles: roles,
  });
};

const postCreateUserPage = async (req: Request, res: Response) => {
  const { fullName, username, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? null;
  //handle create user
  await handleCreateUser(fullName, username, address, phone, avatar, role);
  return res.redirect("/admin/user");
};

const postDeleteUserPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteUser(id);
  return res.redirect("/admin/user");
};

const getViewUserPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await handleViewUser(id);
  const roles = await getAllRoles();
  return res.render("admin/user/detail.ejs", {
    id: id,
    user: user,
    roles,
  });
};

const postUpdateUserPage = async (req: Request, res: Response) => {
  const { id, fullName, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? undefined;
  await handleUpdateUser(id, fullName, phone, role, address, avatar);
  return res.redirect("/admin/user");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUserPage,
  postDeleteUserPage,
  getViewUserPage,
  postUpdateUserPage,
};
