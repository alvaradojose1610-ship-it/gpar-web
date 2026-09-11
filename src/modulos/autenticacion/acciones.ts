"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  crearSesion,
  destruirSesion,
  verificarClave,
} from "@/modulos/autenticacion/servicio-sesion";
import { prisma } from "@/lib/prisma";

const esquemaLogin = z.object({
  usuario: z.string().trim().min(1, "Indica tu usuario."),
  clave: z.string().min(1, "Indica tu contraseña."),
  next: z.string().optional(),
});

export type ResultadoLogin = {
  ok: false;
  mensaje: string;
};

function rutaSeguraNext(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/panel";
  }
  if (!next.startsWith("/panel")) {
    return "/panel";
  }
  return next;
}

export async function accionIniciarSesion(
  _prev: ResultadoLogin | null,
  formData: FormData,
): Promise<ResultadoLogin | null> {
  const parseado = esquemaLogin.safeParse({
    usuario: formData.get("usuario"),
    clave: formData.get("clave"),
    next: formData.get("next") || undefined,
  });

  if (!parseado.success) {
    return {
      ok: false,
      mensaje: parseado.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const { usuario, clave, next } = parseado.data;

  try {
    const registro = await prisma.usuario.findUnique({
      where: { usuario },
    });

    if (!registro || !registro.activo) {
      return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
    }

    const valida = await verificarClave(clave, registro.claveHash);
    if (!valida) {
      return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
    }

    await crearSesion(registro.id);
  } catch (error) {
    const mensaje =
      error instanceof Error &&
      (error.message.includes("DATABASE_URL") ||
        error.message.includes("SESSION_SECRET") ||
        error.message.includes("connect") ||
        error.message.includes("Can't reach"))
        ? "No se pudo conectar a la base de datos. Verifica Neon y las variables de entorno."
        : "No se pudo iniciar sesión. Intenta de nuevo o revisa la configuración.";

    return { ok: false, mensaje };
  }

  redirect(rutaSeguraNext(next));
}

export async function accionCerrarSesion(): Promise<void> {
  await destruirSesion();
  redirect("/login");
}
