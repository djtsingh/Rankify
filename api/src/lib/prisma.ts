import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// Singleton pattern for Prisma Client
// Prevents multiple instances in serverless environment
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
