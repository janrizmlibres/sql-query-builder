"use server";

import prisma from "@/lib/prisma";
import { Field } from "react-querybuilder";
import { NotFoundError } from "../http-errors";

export const getTableFields = async (dbTableName: string): Promise<Field[]> => {
  const result = await prisma.$queryRaw<{ fields: Field[] | null }[]>`
    SELECT json_agg(
      json_build_object(
        'name', column_name,
        'value', column_name,
        'label', column_name,
        'datatype', CASE
          WHEN data_type LIKE '%char%' OR data_type = 'text' THEN 'text'
          WHEN data_type IN ('integer', 'bigint', 'smallint', 'decimal', 'numeric', 'real', 'double precision') THEN 'number'
          WHEN data_type = 'date' THEN 'date'
          WHEN data_type LIKE 'timestamp%' THEN 'datetime-local'
          WHEN data_type LIKE 'time%' THEN 'time'
          WHEN data_type = 'boolean' THEN 'boolean'
          ELSE 'text'
        END,
        'inputType', CASE
          WHEN data_type LIKE '%char%' OR data_type = 'text' THEN 'text'
          WHEN data_type IN ('integer', 'bigint', 'smallint', 'decimal', 'numeric', 'real', 'double precision') THEN 'number'
          WHEN data_type = 'date' THEN 'date'
          WHEN data_type LIKE 'timestamp%' THEN 'datetime-local'
          WHEN data_type LIKE 'time%' THEN 'time'
          WHEN data_type = 'boolean' THEN 'boolean'
          ELSE 'text'
        END
      ) ORDER BY ordinal_position
    ) AS fields
    FROM information_schema.columns
    WHERE table_name = ${dbTableName} AND column_name <> 'id';
  `;

  const fields = result[0]?.fields;

  if (!fields) {
    throw new NotFoundError(`Table "${dbTableName}"`);
  }

  return fields;
};