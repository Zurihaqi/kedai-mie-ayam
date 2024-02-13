import { PrismaClient } from "@prisma/client";
import { withExclude } from "prisma-exclude";

const globalForPrisma = global as { prisma?: PrismaClient };

const prismaClientWithExclude = withExclude(
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] })
);

export const prisma = prismaClientWithExclude;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
