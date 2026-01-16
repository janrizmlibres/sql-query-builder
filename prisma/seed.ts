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
  {
    name: "Charlie",
    email: "charlie@prisma.io",
    age: 32,
    gender: "male",
    isAdmin: false,
  },
  {
    name: "Diana",
    email: "diana@prisma.io",
    age: 28,
    gender: "female",
    isAdmin: true,
  },
  {
    name: "Edward",
    email: "edward@prisma.io",
    age: 45,
    gender: "male",
    isAdmin: false,
  },
  {
    name: "Fiona",
    email: "fiona@prisma.io",
    age: 22,
    gender: "female",
    isAdmin: false,
  },
  {
    name: "George",
    email: "george@prisma.io",
    age: 38,
    gender: "male",
    isAdmin: true,
  },
  {
    name: "Hannah",
    email: "hannah@prisma.io",
    age: 29,
    gender: "female",
    isAdmin: false,
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
  {
    name: "Initech",
    country: "USA",
    industry: "Finance",
    website: "https://initech.example.com",
    employeeCount: 85,
    isActive: true,
  },
  {
    name: "Umbrella Corp",
    country: "Japan",
    industry: "Pharmaceuticals",
    website: "https://umbrella.example.com",
    employeeCount: 5000,
    isActive: true,
  },
  {
    name: "Stark Industries",
    country: "USA",
    industry: "Defense",
    website: "https://stark.example.com",
    employeeCount: 12000,
    isActive: true,
  },
  {
    name: "Wayne Enterprises",
    country: "USA",
    industry: "Conglomerate",
    website: "https://wayne.example.com",
    employeeCount: 8500,
    isActive: false,
  },
  {
    name: "Oscorp",
    country: "USA",
    industry: "Biotechnology",
    website: "https://oscorp.example.com",
    employeeCount: 3200,
    isActive: true,
  },
  {
    name: "Cyberdyne Systems",
    country: "USA",
    industry: "Robotics",
    website: "https://cyberdyne.example.com",
    employeeCount: 450,
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
  {
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
    price: new Prisma.Decimal(45.99),
  },
  {
    name: "Webcam HD",
    description: "1080p HD webcam with built-in microphone and privacy cover",
    price: new Prisma.Decimal(59.99),
  },
  {
    name: "Monitor Stand",
    description: "Adjustable aluminum monitor stand with storage drawer",
    price: new Prisma.Decimal(34.5),
  },
  {
    name: "Laptop Cooling Pad",
    description: "Slim cooling pad with dual fans and adjustable height",
    price: new Prisma.Decimal(29.99),
  },
  {
    name: "Desk Lamp LED",
    description: "Adjustable LED desk lamp with touch dimmer and USB charging port",
    price: new Prisma.Decimal(42.0),
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