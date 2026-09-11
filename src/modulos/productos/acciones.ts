"use server";

import { LineaNegocio } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

const esquema = z.object({
  codigo: z.string().trim().min(2).max(64),
  nombre: z.string().trim().min(2).max(200),
  linea: z.enum(["INDUSTRIAL", "AUTOMOTRIZ"]),
  categoriaId: z.string().min(1),
  descripcion: z.string().trim().max(2000).optional(),
  aplicacion: z.string().trim().max(500).optional(),
  modelo: z.string().trim().max(120).optional(),
  tipo: z.string().trim().max(120).optional(),
  tamano: z.string().trim().max(120).optional(),
  visibleWeb: z.boolean().default(true),
});

export async function accionCrearProducto(formData: FormData) {
  await requerirSesion();

  const parsed = esquema.safeParse({
    codigo: formData.get("codigo"),
    nombre: formData.get("nombre"),
    linea: formData.get("linea"),
    categoriaId: formData.get("categoriaId"),
    descripcion: String(formData.get("descripcion") ?? "") || undefined,
    aplicacion: String(formData.get("aplicacion") ?? "") || undefined,
    modelo: String(formData.get("modelo") ?? "") || undefined,
    tipo: String(formData.get("tipo") ?? "") || undefined,
    tamano: String(formData.get("tamano") ?? "") || undefined,
    visibleWeb: formData.get("visibleWeb") === "on",
  });

  if (!parsed.success) {
    redirect("/panel/productos/nuevo?error=datos");
  }

  const datos = parsed.data;
  const existe = await prisma.producto.findUnique({
    where: { codigo: datos.codigo },
  });
  if (existe) {
    redirect("/panel/productos/nuevo?error=codigo");
  }

  await prisma.producto.create({
    data: {
      codigo: datos.codigo.toUpperCase(),
      nombre: datos.nombre,
      linea: datos.linea as LineaNegocio,
      categoriaId: datos.categoriaId,
      descripcion: datos.descripcion ?? null,
      aplicacion: datos.aplicacion ?? null,
      modelo: datos.modelo ?? null,
      tipo: datos.tipo ?? null,
      tamano: datos.tamano ?? null,
      visibleWeb: datos.visibleWeb,
      estado: "ACTIVO",
    },
  });

  revalidatePath("/panel/productos");
  revalidatePath("/industrial");
  revalidatePath("/automotriz");
  redirect("/panel/productos");
}
