"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { TAG_CATALOGO_PUBLICO } from "@/lib/imagen-producto-constantes";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

const esquemaHero = z.object({
  tituloHero: z.string().trim().min(2).max(200),
  subtituloHero: z.string().trim().min(2).max(600),
});

export async function accionActualizarHeroInicio(formData: FormData) {
  await requerirPermiso(
    CODIGOS_PERMISO.PANEL_VER,
    "/panel/configuracion",
  );

  const parsed = esquemaHero.safeParse({
    tituloHero: String(formData.get("tituloHero") ?? ""),
    subtituloHero: String(formData.get("subtituloHero") ?? ""),
  });

  if (!parsed.success) {
    redirect("/panel/configuracion?error=datos");
  }

  const existente = await prisma.configuracionEmpresa.findFirst({
    where: { activo: true },
    orderBy: { creadoEn: "asc" },
  });

  if (!existente) {
    redirect("/panel/configuracion?error=empresa");
  }

  await prisma.configuracionEmpresa.update({
    where: { id: existente.id },
    data: {
      tituloHero: parsed.data.tituloHero,
      subtituloHero: parsed.data.subtituloHero,
    },
  });

  updateTag(TAG_CATALOGO_PUBLICO);
  revalidatePath("/");
  revalidatePath("/panel/configuracion");
  redirect("/panel/configuracion?ok=hero");
}
