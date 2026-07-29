import { PrismaClient } from "../../prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export * from "../../prisma/index.js";
