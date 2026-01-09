import { getUsers } from "@/lib/actions/user.action";
import { getCompanies } from "@/lib/actions/company.action";
import { getProducts } from "@/lib/actions/product.action";
import { Company, Product, User } from "@/app/generated/prisma/client";

interface ModelStrategy<T> {
  fetchData: (params: PaginatedSearchParams) => Promise<ActionResponse<PaginatedResponse<T>>>;
  getColumns: () => (keyof T)[];
  getTableName: () => string;
}

class UserModel implements ModelStrategy<User> {
  fetchData = getUsers;
  getColumns = (): (keyof User)[] => ["name", "email", "age", "gender", "isAdmin", "createdAt", "updatedAt"];
  getTableName = () => "User";
}

class CompanyModel implements ModelStrategy<Company> {
  fetchData = getCompanies;
  getColumns = (): (keyof Company)[] => ["name", "industry", "country", "employeeCount", "isActive", "createdAt", "updatedAt"];
  getTableName = () => "Company";
}

class ProductModel implements ModelStrategy<Product> {
  fetchData = getProducts;
  getColumns = (): (keyof Product)[] => ["name", "price", "description", "createdAt", "updatedAt"];
  getTableName = () => "Product";
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