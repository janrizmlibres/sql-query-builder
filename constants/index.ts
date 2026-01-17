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

export const VALUE_LESS_OPERATORS = ['null', 'notNull'];

export const BOOLEAN_OPTIONS = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];

export const PAGINATION_CONFIG = {
  pageParam: 'page',
  defaultPage: 1,
  defaultPageSize: 5,
};