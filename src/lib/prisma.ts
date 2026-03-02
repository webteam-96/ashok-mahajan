import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

// ─── Prisma v7 with libsql driver adapter for SQLite ──────────────────────────
// The DB file lives at <project-root>/dev.db (created by `prisma migrate dev`)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // DATABASE_URL = "file:./dev.db" → strip the "file:" prefix
  const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  const dbFile = dbUrl.replace(/^file:/, '')

  // Resolve relative paths against the project root (cwd at build / runtime)
  const absolutePath = path.isAbsolute(dbFile)
    ? dbFile
    : path.resolve(process.cwd(), dbFile)

  const adapter = new PrismaLibSql({ url: `file:${absolutePath}` })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
