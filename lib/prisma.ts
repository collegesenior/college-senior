import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })
}

const prisma = (globalThis as any).prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') (globalThis as any).prisma = prisma

export { prisma };
