import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

/**
 * Carga `.env` y luego `.env.local` (este último tiene prioridad)
 * para CLI de Prisma / seed fuera de Next.js.
 */
export function cargarEnvLocal() {
  for (const nombre of [".env", ".env.local"] as const) {
    const ruta = resolve(process.cwd(), nombre);
    if (!existsSync(ruta)) continue;
    for (const linea of readFileSync(ruta, "utf8").split(/\r?\n/)) {
      const trimmed = linea.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const clave = trimmed.slice(0, eq).trim();
      let valor = trimmed.slice(eq + 1).trim();
      if (
        (valor.startsWith('"') && valor.endsWith('"')) ||
        (valor.startsWith("'") && valor.endsWith("'"))
      ) {
        valor = valor.slice(1, -1);
      }
      // .env.local debe poder sobrescribir .env
      if (nombre === ".env.local" || process.env[clave] === undefined) {
        process.env[clave] = valor;
      }
    }
  }
}
