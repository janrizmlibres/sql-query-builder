import { RuleGroupType } from "react-querybuilder"

export const TABLE_CONFIG = {
  queryParam: 'table',
  defaultTable: 'users',
  tables: ['users', 'companies', 'products'],
}

interface QueryConfig {
  queryParam: string;
  defaultQuery: RuleGroupType;
  debounceTime: number;
}

export const QUERY_CONFIG: QueryConfig = {
  queryParam: 'q',
  defaultQuery: {
    combinator: 'and',
    rules: [],
  },
  debounceTime: 500,
}