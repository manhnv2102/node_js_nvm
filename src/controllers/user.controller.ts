import { Request, Response } from "express";
import {
  getAllUsers,
  handleCreateUser,
  handleDeleteUser,
  handleViewUser,
  handleUpdateUser,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  //get users
  const users = await getAllUsers();
  return res.render("home", {
    users: users,
  });
};
const getCreateUserPage = async (req: Request, res: Response) => {
  return res.render("create-user");
};

const postCreateUserPage = async (req: Request, res: Response) => {
  const { fullName, email, address } = req.body;
  const a = await handleCreateUser(fullName, email, address);
  return res.redirect("/");
};

const postDeleteUserPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const a = await handleDeleteUser(id);
  return res.redirect("/");
};

const getViewUserPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await handleViewUser(id);
  return res.render("view-user", {
    id: id,
    user: user,
  });
};

const postUpdateUserPage = async (req: Request, res: Response) => {
  const { id, fullName, email, address } = req.body;
  const a = await handleUpdateUser(id, fullName, email, address);
  return res.redirect("/");
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUserPage,
  postDeleteUserPage,
  getViewUserPage,
  postUpdateUserPage,
};
