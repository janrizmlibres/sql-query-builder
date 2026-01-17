"use server";

import { Prisma, Company } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import handleError from "@/lib/handlers/error";
import { Field, RuleGroupType, formatQuery } from "react-querybuilder";
import { PAGINATION_CONFIG } from "@/constants";

export const getCompanies = async (
  sqlQuery?: RuleGroupType | null,
  params?: PaginatedSearchParams,
  fields?: Field[]
): Promise<ActionResponse<PaginatedResponse<Company>>> => {
  const { defaultPage, defaultPageSize } = PAGINATION_CONFIG;
  const { page = defaultPage, pageSize = defaultPageSize, query, filter } = params || {};
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let where: Prisma.CompanyWhereInput = {};

  if (sqlQuery) {
    where = formatQuery(sqlQuery, { 
      format: 'prisma', 
      parseNumbers: true, 
      fields,
    });
  } else if (query) {
    where.OR = [
      { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { industry: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { country: { contains: query, mode: Prisma.QueryMode.insensitive } },
    ];
  }

  let orderBy: Prisma.CompanyOrderByWithRelationInput = {};

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
    const [totalCompanies, companies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({ where, orderBy, skip, take }),
    ]);

    const isNext = totalCompanies > skip + companies.length;

    return {
      success: true,
      data: { items: JSON.parse(JSON.stringify(companies)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getCompaniesCount = async (sqlQuery?: RuleGroupType | null): Promise<ActionResponse<DataCountResponse>> => {
  let where: Prisma.CompanyWhereInput = {};
  
  if (sqlQuery) {
    where = formatQuery(sqlQuery, { 
      format: 'prisma', 
      parseNumbers: true, 
    });
  }

  try {
    const count = await prisma.company.count({ where });
    return { success: true, data: { count } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};