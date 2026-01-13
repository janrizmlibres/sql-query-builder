"use server";

import { Prisma, Product } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import handleError from "@/lib/handlers/error";
import { Field, RuleGroupType, formatQuery } from "react-querybuilder";

export const getProducts = async (
  sqlQuery?: RuleGroupType | null,
  params?: PaginatedSearchParams,
  fields?: Field[]
): Promise<ActionResponse<PaginatedResponse<Product>>> => {
  const { page = 1, pageSize = 10, query, filter } = params || {};
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let where: Prisma.ProductWhereInput = {};
  
  if (sqlQuery) {
    where = formatQuery(sqlQuery, { 
      format: 'prisma', 
      parseNumbers: true, 
      fields,
    });
  } else if (query) {
    where.OR = [
      { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = {};

  switch (filter) {
    case "newest":
      orderBy = { createdAt: Prisma.SortOrder.desc };
      break;
    case "oldest":
      orderBy = { createdAt: Prisma.SortOrder.asc };
      break;
    default:
      orderBy = { createdAt: Prisma.SortOrder.desc };
  }

  try {
    const [totalProducts, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, orderBy, skip, take }),
    ]);

    const isNext = totalProducts > skip + products.length;

    return {
      success: true,
      data: { items: JSON.parse(JSON.stringify(products)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
