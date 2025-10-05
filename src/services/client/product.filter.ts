import { prisma } from "config/client";

const userFilter = async (usernameInput: string) => {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: usernameInput,
      },
    },
  });
};

const yeuCau1 = async (minPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
      },
    },
  });
};

const yeuCau2 = async (maxPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        lte: maxPrice,
      },
    },
  });
};

const yeuCau3 = async (factory: string) => {
  return await prisma.product.findMany({
    where: {
      factory: {
        equals: factory,
      },
    },
  });
};

const yeuCau4 = async (factory: string[]) => {
  return await prisma.product.findMany({
    where: {
      factory: {
        in: factory,
      },
    },
  });
};
const yeuCau5 = async (minPrice: number, maxPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
  });
};
const yeuCau6 = async (
  min1: number,
  max1: number,
  min2: number,
  max2: number
) => {
  return await prisma.product.findMany({
    where: {
      OR: [
        {
          price: { gte: min1, lte: max1 }, // giá >= minPrice
        },
        {
          price: { gte: min2, lte: max2 }, // giá <= maxPrice
        },
      ],
    },
  });
};
const yeuCau7 = async () => {
  return await prisma.product.findMany({
    orderBy: {
      price: "asc",
    },
  });
};

const getProductWithFilter = async (
  page: number,
  pageSize: number,
  factory: string,
  target: string,
  price: string,
  sort: string
) => {
  //build where query
  let whereClause: any = {};

  if (factory) {
    const factoryInput = factory.split(",");
    whereClause.factory = {
      in: factoryInput,
    };
  }

  if (target) {
    const targetInput = target.split(",");
    whereClause.target = {
      in: targetInput,
    };
  }

  if (price) {
    const priceInput = price.split(",");
    //["duoi-10-trieu","10-15-trieu","15-20-trieu","tren-20-trieu"]
    const priceCondition = [];
    for (let i = 0; i < priceInput.length; i++) {
      if (priceInput[i] === "duoi-10-trieu") {
        priceCondition.push({ price: { lt: 10000000 } });
      }
      if (priceInput[i] === "10-15-trieu") {
        priceCondition.push({ price: { gte: 10000000, lte: 15000000 } });
      }
      if (priceInput[i] === "15-20-trieu") {
        priceCondition.push({ price: { gte: 15000000, lte: 20000000 } });
      }
      if (priceInput[i] === "tren-20-trieu") {
        priceCondition.push({ price: { gt: 20000000 } });
      }
    }

    whereClause.OR = priceCondition;
  }

  //build short query
  let orderByClause: any = {};

  if (sort === "gia-tang-dan") {
    orderByClause = {
      price: "asc",
    };
  }

  if (sort === "gia-giam-dan") {
    orderByClause = {
      price: "desc",
    };
  }

  const skip = (page - 1) * pageSize;
  const [products, count] = await prisma.$transaction([
    prisma.product.findMany({
      skip: skip,
      take: pageSize,
      where: whereClause,
      orderBy: orderByClause,
    }),

    prisma.product.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(count / pageSize);

  return { products, totalPages };
};

export {
  userFilter,
  yeuCau1,
  yeuCau2,
  yeuCau3,
  yeuCau4,
  yeuCau5,
  yeuCau6,
  yeuCau7,
  getProductWithFilter,
};
