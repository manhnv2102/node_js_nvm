import { Request, Response } from "express";
import { getProductByID } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductByID(id);
  return res.render("client/products/detail.ejs", {
    product,
  });
};

export { getProductPage };
