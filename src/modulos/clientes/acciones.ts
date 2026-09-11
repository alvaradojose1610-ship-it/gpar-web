"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

const esquema = z.object({
  nombre: z.string().trim().min(2).max(200),
  telefono: z.string().trim().max(40).optional(),
  correo: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().email().max(120).optional(),
  ),
  empresa: z.string().trim().max(200).optional(),
  direccion: z.string().trim().max(300).optional(),
  activo: z.boolean(),
});

function parseForm(formData: FormData) {
  return esquema.safeParse({
    nombre: formData.get("nombre"),
    telefono: String(formData.get("telefono") ?? "") || undefined,
    correo: String(formData.get("correo") ?? "") || undefined,
    empresa: String(formData.get("empresa") ?? "") || undefined,
    direccion: String(formData.get("direccion") ?? "") || undefined,
    activo: formData.get("activo") === "on",
  });
}

export async function accionCrearCliente(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.CLIENTES_EDITAR);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect("/panel/clientes/nuevo?error=datos");
  }

  const d = parsed.data;
  await prisma.cliente.create({
    data: {
      nombre: d.nombre,
      telefono: d.telefono ?? null,
      correo: d.correo ?? null,
      empresa: d.empresa ?? null,
      direccion: d.direccion ?? null,
      estado: d.activo ? "ACTIVO" : "INACTIVO",
    },
  });

  revalidatePath("/panel/clientes");
  redirect("/panel/clientes?ok=creado");
}

export async function accionActualizarCliente(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.CLIENTES_EDITAR);

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/clientes?error=datos");

  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/panel/clientes/${id}/editar?error=datos`);
  }

  const d = parsed.data;
  await prisma.cliente.update({
    where: { id },
    data: {
      nombre: d.nombre,
      telefono: d.telefono ?? null,
      correo: d.correo ?? null,
      empresa: d.empresa ?? null,
      direccion: d.direccion ?? null,
      estado: d.activo ? "ACTIVO" : "INACTIVO",
    },
  });

  revalidatePath("/panel/clientes");
  redirect("/panel/clientes?ok=actualizado");
}
