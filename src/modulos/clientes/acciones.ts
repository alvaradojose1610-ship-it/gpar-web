"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

const esquema = z.object({
  nombre: z.string().trim().min(2).max(200),
  telefono: z.string().trim().max(40).optional(),
  correo: z.string().trim().email().max(120).optional().or(z.literal("")),
  empresa: z.string().trim().max(200).optional(),
  direccion: z.string().trim().max(300).optional(),
});

export async function accionCrearCliente(formData: FormData) {
  await requerirSesion();

  const parsed = esquema.safeParse({
    nombre: formData.get("nombre"),
    telefono: String(formData.get("telefono") ?? "") || undefined,
    correo: String(formData.get("correo") ?? "") || undefined,
    empresa: String(formData.get("empresa") ?? "") || undefined,
    direccion: String(formData.get("direccion") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/panel/clientes/nuevo?error=datos");
  }

  const d = parsed.data;
  await prisma.cliente.create({
    data: {
      nombre: d.nombre,
      telefono: d.telefono ?? null,
      correo: d.correo || null,
      empresa: d.empresa ?? null,
      direccion: d.direccion ?? null,
      estado: "ACTIVO",
    },
  });

  revalidatePath("/panel/clientes");
  redirect("/panel/clientes");
}
