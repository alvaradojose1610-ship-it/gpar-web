import { defineConfig } from "prisma/config";

/**
 * Configuración Prisma ORM 7+.
 * Las URLs ya no van en schema.prisma.
 * Preferir DIRECT_URL para CLI (migrate/db push) si hay pooler.
 * process.env (no env()) para que `prisma generate` funcione sin .env.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
