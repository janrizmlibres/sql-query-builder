import { getUsers } from "@/lib/actions/user.action";
import { getCompanies } from "@/lib/actions/company.action";
import { getProducts } from "@/lib/actions/product.action";
import { Company, Product, User } from "@/app/generated/prisma/client";
import { defaultOperators, Field, RuleGroupType, RuleType, ValidationResult } from "react-querybuilder";
import { getTableFields } from "../actions/schema.action";

const TEXT_OPERATORS_WITHOUT_NULL_AND_NOT_NULL = [
  { name: '=', label: 'is' },
  { name: '!=', label: 'is not' },
  ...defaultOperators.filter(op =>
    [
      'contains',
      'beginsWith',
      'endsWith',
      'doesNotContain',
      'doesNotBeginWith',
      'doesNotEndWith',
    ].includes(op.name)
  ),
]

const getValidatedFields = (fields: Field[], fieldsToValidate: string[]) => {
  return fields.map(field => {
    if (!fieldsToValidate.includes(field.name)) return field;

    return {
      ...field,
      validator: (r: RuleType): ValidationResult => {
        const invalid = r.value == null || r.value === "";
        return { valid: !invalid, reasons: invalid ? ["Value is required"] : undefined };
      }
    };
  });
}

interface GetQueryFieldsOptions {
  withValidators?: boolean;
}

export interface ModelStrategy<T> {
  fetchData: (
    sqlQuery?: RuleGroupType | null,
    params?: PaginatedSearchParams,
    fields?: Field[]
  ) => Promise<ActionResponse<PaginatedResponse<T>>>;
  getColumns: () => (keyof T)[];
  getQueryFields: (options?: GetQueryFieldsOptions) => Promise<Field[]>;
  getQueryFieldsWithValidators: (fields: Field[]) => Field[];
}

class UserModel implements ModelStrategy<User> {
  fetchData = getUsers;
  getColumns = (): (keyof User)[] => ["name", "email", "age", "gender", "isAdmin", "createdAt", "updatedAt"];
  getQueryFields = async (options?: GetQueryFieldsOptions) => {
    const fields = await getTableFields("User");

    const mappedFields = fields.map(field => {
      switch (field.name) {
        case "email":
          return {
            ...field,
            operators: TEXT_OPERATORS_WITHOUT_NULL_AND_NOT_NULL,
          }
        default:
          return field;
      }
    });

    if (options?.withValidators) {
      return this.getQueryFieldsWithValidators(mappedFields);
    }

    return mappedFields;
  };
  getQueryFieldsWithValidators = (fields: Field[]) => {
    const fieldsToValidate = ['age', 'isAdmin', 'createdAt', 'updatedAt'];
    return getValidatedFields(fields, fieldsToValidate);
  };
}

class CompanyModel implements ModelStrategy<Company> {
  fetchData = getCompanies;
  getColumns = (): (keyof Company)[] => ["name", "industry", "country", "employeeCount", "isActive", "createdAt", "updatedAt"];
  getQueryFields = async (options?: GetQueryFieldsOptions) => {
    const fields = await getTableFields("Company");

    const mappedFields = fields.map(field => {
      switch (field.name) {
        case "name":
          return {
            ...field,
            operators: TEXT_OPERATORS_WITHOUT_NULL_AND_NOT_NULL,
          }
        case "employeeCount":
          return {
            ...field,
            operators: [
              ...defaultOperators.filter(op => ['=', '!='].includes(op.name)),
              { name: '<', label: 'less than' },
              { name: '<=', label: 'less than or equal to' },
              { name: '>', label: 'greater than' },
              { name: '>=', label: 'greater than or equal to' },
            ],
          }
        default:
          return field;
      }
    });

    if (options?.withValidators) {
      return this.getQueryFieldsWithValidators(mappedFields);
    }

    return mappedFields;
  };
  getQueryFieldsWithValidators = (fields: Field[]) => {
    const fieldsToValidate = ['employeeCount', 'isActive','createdAt', 'updatedAt'];
    return getValidatedFields(fields, fieldsToValidate);
  };
}

class ProductModel implements ModelStrategy<Product> {
  fetchData = getProducts;
  getColumns = (): (keyof Product)[] => ["name", "price", "description", "createdAt", "updatedAt"];
  getQueryFields = async (options?: GetQueryFieldsOptions) => {
    const fields = await getTableFields("Product");

    const mappedFields = fields.map(field => {
      switch (field.name) {
        case "name":
          return {
            ...field,
            operators: TEXT_OPERATORS_WITHOUT_NULL_AND_NOT_NULL,
          }
        default:
          return field;
      }
    });

    if (options?.withValidators) {
      return this.getQueryFieldsWithValidators(mappedFields);
    }

    return mappedFields;
  };
  getQueryFieldsWithValidators = (fields: Field[]) => {
    const fieldsToValidate = ['price', 'createdAt', 'updatedAt'];
    return getValidatedFields(fields, fieldsToValidate);
  };
}

export class ModelFactory {
  private static models = {
    users: new UserModel(),
    companies: new CompanyModel(),
    products: new ProductModel(),
  };

  static getModel(tableName: string) {
    const model = this.models[tableName as keyof typeof this.models];
    if (!model) {
      throw new Error(`No model found for table: ${tableName}`);
    }
    return model as ModelStrategy<User | Company | Product>;
  }
}