import { jwtVerify } from "jose";

export type PayloadSesionJwt = {
  sub: string;
  usuario: string;
  nombre: string;
  versionSesion: number;
  permisos: string[];
};

function codificarSecreto(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/**
 * Verifica un JWT HS256 (jose). Seguro para Edge / middleware.
 * No usa crypto Node pesado.
 */
export async function verificarJwtHs256(
  token: string,
  secret: string,
): Promise<PayloadSesionJwt | null> {
  try {
    const { payload } = await jwtVerify(token, codificarSecreto(secret), {
      algorithms: ["HS256"],
    });

    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const usuario =
      typeof payload.usuario === "string" ? payload.usuario : null;
    const nombre = typeof payload.nombre === "string" ? payload.nombre : null;
    const versionSesion =
      typeof payload.versionSesion === "number" ? payload.versionSesion : null;
    const permisos = Array.isArray(payload.permisos)
      ? payload.permisos.filter((p): p is string => typeof p === "string")
      : [];

    if (!sub || !usuario || !nombre || versionSesion === null) {
      return null;
    }

    return {
      sub,
      usuario,
      nombre,
      versionSesion,
      permisos,
    };
  } catch {
    return null;
  }
}

export function secretoABytes(secret: string): Uint8Array {
  return codificarSecreto(secret);
}
