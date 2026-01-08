import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    age: 20,
    gender: "female",
    isAdmin: false,
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    age: 25,
    gender: "male",
    isAdmin: true,
  },
];

const companyData: Prisma.CompanyCreateInput[] = [
  {
    name: "Acme Corp",
    country: "USA",
    industry: "Technology",
    website: "https://acme.example.com",
    employeeCount: 250,
    isActive: true,
  },
  {
    name: "Globex Inc",
    country: "Germany",
    industry: "Manufacturing",
    website: "https://globex.example.com",
    employeeCount: 1200,
    isActive: false,
  },
];

const productData: Prisma.ProductCreateInput[] = [
  {
    name: "Wireless Mouse",
    description: "Ergonomic 2.4GHz wireless mouse with USB receiver",
    price: new Prisma.Decimal(19.99),
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches",
    price: new Prisma.Decimal(89.99),
  },
  {
    name: "Noise-Cancelling Headphones",
    description: "Over-ear Bluetooth headphones with active noise cancelling",
    price: new Prisma.Decimal(129.5),
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }

  for (const c of companyData) {
    await prisma.company.create({ data: c });
  }

  for (const p of productData) {
    await prisma.product.create({ data: p });
  }
}

main();