/**
 * Lectura y validación de variables de entorno (servidor).
 * Validación perezosa para no romper el build sin Neon.
 */

function leerEnv(nombre: string): string | undefined {
  const valor = process.env[nombre];
  if (valor === undefined || valor.trim() === "") return undefined;
  return valor.trim();
}

export function obtenerDatabaseUrl(): string {
  const url = leerEnv("DATABASE_URL");
  if (!url) {
    throw new Error(
      "DATABASE_URL no está configurada. Configura la conexión a Neon en .env.",
    );
  }
  return url;
}

export function obtenerDirectUrl(): string | undefined {
  return leerEnv("DIRECT_URL");
}

/** Secret JWT: mínimo 32 caracteres. */
export function obtenerSessionSecret(): string {
  const secret = leerEnv("SESSION_SECRET");
  if (!secret) {
    throw new Error(
      "SESSION_SECRET no está configurada. Añádela en .env (mínimo 32 caracteres).",
    );
  }
  if (secret.length < 32) {
    throw new Error(
      "SESSION_SECRET debe tener al menos 32 caracteres.",
    );
  }
  return secret;
}

/** Para middleware/edge: no lanza si falta; el caller decide. */
export function leerSessionSecretOpcional(): string | null {
  const secret = leerEnv("SESSION_SECRET");
  if (!secret || secret.length < 32) return null;
  return secret;
}

export function esProduccion(): boolean {
  return process.env.NODE_ENV === "production";
}
