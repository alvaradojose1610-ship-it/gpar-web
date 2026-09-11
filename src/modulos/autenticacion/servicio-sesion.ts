import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { CodigoPermiso } from "@/configuracion/permisos";
import { esProduccion, obtenerSessionSecret } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  secretoABytes,
  verificarJwtHs256,
  type PayloadSesionJwt,
} from "@/lib/verificar-jwt-hs256";
import {
  COOKIE_SESION,
  DURACION_SESION_SEGUNDOS,
} from "@/modulos/autenticacion/constantes";

const RONDAS_BCRYPT = 12;

export type SesionUsuario = {
  id: string;
  usuario: string;
  nombre: string;
  apellido: string | null;
  permisos: string[];
  versionSesion: number;
};

export async function hashearClave(clave: string): Promise<string> {
  return bcrypt.hash(clave, RONDAS_BCRYPT);
}

export async function verificarClave(
  clave: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(clave, hash);
}

async function firmarToken(payload: PayloadSesionJwt): Promise<string> {
  const secret = obtenerSessionSecret();
  return new SignJWT({
    usuario: payload.usuario,
    nombre: payload.nombre,
    versionSesion: payload.versionSesion,
    permisos: payload.permisos,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${DURACION_SESION_SEGUNDOS}s`)
    .sign(secretoABytes(secret));
}

function opcionesCookie(maxAge: number) {
  return {
    httpOnly: true,
    secure: esProduccion(),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function crearSesion(usuarioId: string): Promise<SesionUsuario> {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      roles: {
        include: {
          rol: {
            include: {
              permisos: {
                include: { permiso: true },
              },
            },
          },
        },
      },
    },
  });

  if (!usuario || !usuario.activo) {
    throw new Error("Usuario no encontrado o inactivo.");
  }

  const permisos = [
    ...new Set(
      usuario.roles.flatMap((ur) =>
        ur.rol.activo
          ? ur.rol.permisos.map((rp) => rp.permiso.codigo)
          : [],
      ),
    ),
  ];

  const sesion: SesionUsuario = {
    id: usuario.id,
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    permisos,
    versionSesion: usuario.versionSesion,
  };

  const token = await firmarToken({
    sub: sesion.id,
    usuario: sesion.usuario,
    nombre: sesion.nombre,
    versionSesion: sesion.versionSesion,
    permisos: sesion.permisos,
  });

  const jar = await cookies();
  jar.set(COOKIE_SESION, token, opcionesCookie(DURACION_SESION_SEGUNDOS));

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { ultimoAcceso: new Date() },
  });

  return sesion;
}

export async function destruirSesion(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_SESION, "", opcionesCookie(0));
}

/**
 * Obtiene la sesión actual. Si la BD no está disponible, retorna null
 * (no rompe el layout del panel en build).
 */
export async function obtenerSesion(): Promise<SesionUsuario | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE_SESION)?.value;
    if (!token) return null;

    const secret = obtenerSessionSecret();
    const payload = await verificarJwtHs256(token, secret);
    if (!payload) return null;

    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                permisos: {
                  include: { permiso: true },
                },
              },
            },
          },
        },
      },
    });

    if (!usuario || !usuario.activo) return null;
    if (usuario.versionSesion !== payload.versionSesion) return null;

    const permisos = [
      ...new Set(
        usuario.roles.flatMap((ur) =>
          ur.rol.activo
            ? ur.rol.permisos.map((rp) => rp.permiso.codigo)
            : [],
        ),
      ),
    ];

    return {
      id: usuario.id,
      usuario: usuario.usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      permisos,
      versionSesion: usuario.versionSesion,
    };
  } catch {
    return null;
  }
}

export async function requerirSesion(
  nextPath = "/panel",
): Promise<SesionUsuario> {
  const sesion = await obtenerSesion();
  if (!sesion) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return sesion;
}

export function tienePermiso(
  sesion: SesionUsuario,
  codigo: CodigoPermiso | string,
): boolean {
  return sesion.permisos.includes(codigo);
}

export async function requerirPermiso(
  codigo: CodigoPermiso | string,
  nextPath = "/panel",
): Promise<SesionUsuario> {
  const sesion = await requerirSesion(nextPath);
  if (!tienePermiso(sesion, codigo)) {
    redirect("/panel");
  }
  return sesion;
}
