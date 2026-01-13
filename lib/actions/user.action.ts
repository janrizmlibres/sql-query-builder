"use server";

import { Prisma, User } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import handleError from "@/lib/handlers/error";
import { Field, RuleGroupType, formatQuery } from "react-querybuilder";

export const getUsers = async (
  sqlQuery?: RuleGroupType | null,
  params?: PaginatedSearchParams,
  fields?: Field[]
): Promise<ActionResponse<PaginatedResponse<User>>> => {
  const { page = 1, pageSize = 10, query, filter } = params || {};
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let where: Prisma.UserWhereInput = {};
  
  if (sqlQuery) {
    where = formatQuery(sqlQuery, { format: 'prisma', parseNumbers: true, fields });
  } else if (query) {
    where.OR = [
      { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { email: { contains: query, mode: Prisma.QueryMode.insensitive } },
    ];
  }

  let orderBy: Prisma.UserOrderByWithRelationInput = {};

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
    const [totalUsers, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({ where, orderBy, skip, take }),
    ]);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: { items: JSON.parse(JSON.stringify(users)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};