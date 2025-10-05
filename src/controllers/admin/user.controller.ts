import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  countTotalProductClientPage,
  getProduct,
} from "services/client/item.service";
import {
  getProductWithFilter,
  userFilter,
  yeuCau1,
  yeuCau2,
  yeuCau3,
  yeuCau4,
  yeuCau5,
  yeuCau6,
  yeuCau7,
} from "services/client/product.filter";
import {
  handleCreateUser,
  handleDeleteUser,
  handleViewUser,
  handleUpdateUser,
  getAllRoles,
} from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  const { page } = req.query;
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;
  const totalPages = await countTotalProductClientPage(8);

  const products = await getProduct(currentPage, 8);
  return res.render("client/home/show.ejs", {
    products,
    totalPages: +totalPages,
    page: +currentPage,
  });
};
const getProductFilterPage = async (req: Request, res: Response) => {
  const {
    page,
    factory = "",
    target = "",
    price = "",
    sort = "",
  } = req.query as {
    page?: string;
    factory: string;
    target: string;
    price: string;
    sort: string;
  };

  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  // const totalPages = await countTotalProductClientPage(6);
  // const products = await getProduct(currentPage, 6);

  const data = await getProductWithFilter(
    currentPage,
    6,
    factory,
    target,
    price,
    sort
  );

  return res.render("client/products/filter.ejs", {
    products: data.products,
    totalPages: +data.totalPages,
    page: +currentPage,
  });

  // const users = await userFilter(username as string);

  // const { minPrice, maxPrice, factory, price } = req.query;

  // //Yêu cầu 1
  // // const products = await yeuCau1(+minPrice);

  // //Yêu cầu 2
  // // const products = await yeuCau2(+maxPrice);

  // //Yêu cầu 3
  // // const products = await yeuCau3(factory as string);

  // //Yêu cầu 4
  // // const products = await yeuCau4((factory as string).split(","));

  // //Yêu cầu 5
  // // const products = await yeuCau5(10000000, 15000000);

  // //Yêu cầu 6
  // // const products = await yeuCau6(10000000, 15000000, 16000000, 20000000);

  // //Yêu cầu 7
  // const products = await yeuCau7();

  // res.status(200).json({
  //   data: products,
  // });
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
  getProductFilterPage,
};
