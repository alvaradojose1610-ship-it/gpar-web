import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { obtenerDatabaseUrl } from "@/lib/env";

const globalParaPrisma = globalThis as unknown as {
  prismaGpar?: PrismaClient;
  poolGpar?: Pool;
};

function crearCliente(): PrismaClient {
  const connectionString = obtenerDatabaseUrl();
  const pool =
    globalParaPrisma.poolGpar ??
    new Pool({
      connectionString,
    });

  if (process.env.NODE_ENV !== "production") {
    globalParaPrisma.poolGpar = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function obtenerCliente(): PrismaClient {
  if (!globalParaPrisma.prismaGpar) {
    globalParaPrisma.prismaGpar = crearCliente();
  }
  return globalParaPrisma.prismaGpar;
}

/**
 * Singleton perezoso de PrismaClient (Prisma 7 + adapter pg).
 * No instanciar en Edge/middleware. No falla al importar sin DATABASE_URL.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = obtenerCliente();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
