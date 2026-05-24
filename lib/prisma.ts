import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

globalForPrisma.prisma = prisma