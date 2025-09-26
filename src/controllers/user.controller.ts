import { Request, Response } from "express";
import { handleCreateUser } from "../services/user.service";
const getHomePage = (req: Request, res: Response) => {
  return res.render("home");
};
const getCreateUserPage = (req: Request, res: Response) => {
  return res.render("create-user");
};
const postCreateUserPage = (req: Request, res: Response) => {
  const { email, password } = req.body;

  handleCreateUser(email, password);

  return res.redirect("/");
};

export { getHomePage, getCreateUserPage, postCreateUserPage };
