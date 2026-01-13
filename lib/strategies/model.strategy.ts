import { getUsers } from "@/lib/actions/user.action";
import { getCompanies } from "@/lib/actions/company.action";
import { getProducts } from "@/lib/actions/product.action";
import { Company, Product, User } from "@/app/generated/prisma/client";
import { defaultOperators, Field, RuleGroupType, RuleType, ValidationResult } from "react-querybuilder";
import { getTableFields } from "../actions/schema.action";

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
            operators: [
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
                  'in',
                  'notIn',
                ].includes(op.name)
              ),
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
    return fields.map(field => {
      if (field.name !== 'age') return field;

      return {
        ...field,
        validator: (r: RuleType): ValidationResult => {
          const invalid = r.value == null || r.value === "";
          return { valid: !invalid, reasons: invalid ? ["Value is required"] : undefined };
        }
      };
    });
  };
}

class CompanyModel implements ModelStrategy<Company> {
  fetchData = getCompanies;
  getColumns = (): (keyof Company)[] => ["name", "industry", "country", "employeeCount", "isActive", "createdAt", "updatedAt"];
  getQueryFields = async () => {
    const fields = await getTableFields("Company");
    return fields;
  };
  getQueryFieldsWithValidators = (fields: Field[]) => {
    return fields;
  };
}

class ProductModel implements ModelStrategy<Product> {
  fetchData = getProducts;
  getColumns = (): (keyof Product)[] => ["name", "price", "description", "createdAt", "updatedAt"];
  getQueryFields = async () => {
    const fields = await getTableFields("Product");
    return fields;
  };
  getQueryFieldsWithValidators = (fields: Field[]) => {
    return fields;
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