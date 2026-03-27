// import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Global type declaration at top level
declare global {
  var prisma: any | undefined;
}

// Mock PrismaClient for build environment
class MockPrismaClient {
  colleges = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({})
  };
  courses = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null)
  };
  updates = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null)
  };
}

let prismaInstance: any;

try {
  // Try to import PrismaClient dynamically
  const { PrismaClient } = require('@prisma/client');
  
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("DATABASE_URL is missing from environment variables!");
  }
  
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false 
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
  
  const adapter = new PrismaPg(pool)
  
  const prismaClientSingleton = () => {
    return new PrismaClient({ 
      adapter,
      log: ['error', 'warn'] 
    })
  }
  
  prismaInstance = (globalThis as any).prisma ?? prismaClientSingleton()
  
  if (process.env.NODE_ENV !== 'production') (globalThis as any).prisma = prismaInstance
} catch (error) {
  // Fallback for build environment
  prismaInstance = new MockPrismaClient();
}

export const prisma = prismaInstance;
