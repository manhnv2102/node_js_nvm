import { Request, Response } from "express";
import { createProduct } from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getAdminCreateProduct = async (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    name: "",
    price: "",
    detailDesc: "",
    shortDesc: "",
    quantity: "",
    factory: "",
    target: "",
  };
  return res.render("admin/product/create.ejs", {
    errors,
    oldData,
  });
};

const postAdminCreateProduct = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TProductSchema;

  const validated = ProductSchema.safeParse(req.body);

  if (!validated.success) {
    const errorsZod = validated.error.issues;
    const errors = errorsZod?.map(
      (item) => `${item.message} (${item.path[0]})`
    );

    const oldData = {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
    };
    return res.render("admin/product/create.ejs", {
      errors,
      oldData,
    });
  }

  const image = req?.file?.filename ?? null;
  await createProduct(
    name,
    +price,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target,
    image
  );
  return res.redirect("/admin/product");
};

export { getAdminCreateProduct, postAdminCreateProduct };
