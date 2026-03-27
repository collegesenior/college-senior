import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Log to console so you can see if the URL is actually loading
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing from environment variables!");
}

const pool = new Pool({
  connectionString,
  // This is the CRITICAL part for Supabase + Prisma 7
  ssl: {
    rejectUnauthorized: false 
  },
  // Adding these for stability
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

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma