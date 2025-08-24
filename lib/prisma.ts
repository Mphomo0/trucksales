// Import the PrismaClient from your generated Prisma client
import { PrismaClient } from '@/lib/generated/prisma/client'

// Extend the global object with a property for holding a PrismaClient instance
// This helps avoid multiple instances in development (hot reloads)
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Export a singleton PrismaClient instance
// If it already exists on global, reuse it
// Otherwise, create a new PrismaClient with logging enabled
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // log various Prisma events
  })

// In development, store the PrismaClient in the global scope
// This avoids creating new instances on every reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
