"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

const esquema = z.object({
  razonSocial: z.string().trim().min(2).max(200),
  nombreComercial: z.string().trim().max(200).optional(),
  telefono: z.string().trim().max(40).optional(),
  correo: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().email().max(120).optional(),
  ),
  direccion: z.string().trim().max(300).optional(),
  personaContacto: z.string().trim().max(120).optional(),
  observaciones: z.string().trim().max(500).optional(),
  activo: z.boolean(),
});

function parseForm(formData: FormData) {
  return esquema.safeParse({
    razonSocial: formData.get("razonSocial"),
    nombreComercial: String(formData.get("nombreComercial") ?? "") || undefined,
    telefono: String(formData.get("telefono") ?? "") || undefined,
    correo: String(formData.get("correo") ?? "") || undefined,
    direccion: String(formData.get("direccion") ?? "") || undefined,
    personaContacto: String(formData.get("personaContacto") ?? "") || undefined,
    observaciones: String(formData.get("observaciones") ?? "") || undefined,
    activo: formData.get("activo") === "on",
  });
}

export async function accionCrearProveedor(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.PROVEEDORES_EDITAR);

  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect("/panel/proveedores/nuevo?error=datos");
  }

  const d = parsed.data;
  await prisma.proveedor.create({
    data: {
      razonSocial: d.razonSocial,
      nombreComercial: d.nombreComercial ?? null,
      telefono: d.telefono ?? null,
      correo: d.correo ?? null,
      direccion: d.direccion ?? null,
      personaContacto: d.personaContacto ?? null,
      observaciones: d.observaciones ?? null,
      estado: d.activo ? "ACTIVO" : "INACTIVO",
    },
  });

  revalidatePath("/panel/proveedores");
  redirect("/panel/proveedores?ok=creado");
}

export async function accionActualizarProveedor(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.PROVEEDORES_EDITAR);

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/proveedores?error=datos");

  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/panel/proveedores/${id}/editar?error=datos`);
  }

  const d = parsed.data;
  await prisma.proveedor.update({
    where: { id },
    data: {
      razonSocial: d.razonSocial,
      nombreComercial: d.nombreComercial ?? null,
      telefono: d.telefono ?? null,
      correo: d.correo ?? null,
      direccion: d.direccion ?? null,
      personaContacto: d.personaContacto ?? null,
      observaciones: d.observaciones ?? null,
      estado: d.activo ? "ACTIVO" : "INACTIVO",
    },
  });

  revalidatePath("/panel/proveedores");
  redirect("/panel/proveedores?ok=actualizado");
}
