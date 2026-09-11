"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

const esquema = z.object({
  razonSocial: z.string().trim().min(2).max(200),
  telefono: z.string().trim().max(40).optional(),
  correo: z.string().trim().email().max(120).optional(),
  direccion: z.string().trim().max(300).optional(),
});

export async function accionCrearProveedor(formData: FormData) {
  await requerirSesion();

  const correoRaw = String(formData.get("correo") ?? "").trim();

  const parsed = esquema.safeParse({
    razonSocial: formData.get("razonSocial"),
    telefono: String(formData.get("telefono") ?? "") || undefined,
    correo: correoRaw || undefined,
    direccion: String(formData.get("direccion") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/panel/proveedores/nuevo?error=datos");
  }

  const datos = parsed.data;

  await prisma.proveedor.create({
    data: {
      razonSocial: datos.razonSocial,
      telefono: datos.telefono ?? null,
      correo: datos.correo ?? null,
      direccion: datos.direccion ?? null,
      estado: "ACTIVO",
    },
  });

  revalidatePath("/panel/proveedores");
  redirect("/panel/proveedores");
}
