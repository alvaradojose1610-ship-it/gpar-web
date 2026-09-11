"use server";

import { LineaNegocio } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  eliminarImagenProducto,
  guardarImagenProducto,
} from "@/lib/imagen-producto";
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

  const producto = await prisma.producto.create({
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

  try {
    const url = await guardarImagenProducto(formData, producto.id);
    if (url) {
      await prisma.producto.update({
        where: { id: producto.id },
        data: { imagenUrl: url },
      });
    }
  } catch {
    // Producto queda sin imagen; se puede editar después
  }

  revalidatePath("/panel/productos");
  revalidatePath("/industrial");
  revalidatePath("/automotriz");
  redirect("/panel/productos");
}

const esquemaEditar = z.object({
  id: z.string().min(1),
  nombre: z.string().trim().min(2).max(200),
  descripcion: z.string().trim().max(2000).optional(),
  aplicacion: z.string().trim().max(500).optional(),
  modelo: z.string().trim().max(120).optional(),
  tipo: z.string().trim().max(120).optional(),
  tamano: z.string().trim().max(120).optional(),
  visibleWeb: z.boolean().default(true),
  destacado: z.boolean().default(false),
  quitarImagen: z.boolean().default(false),
});

export async function accionActualizarProducto(formData: FormData) {
  await requerirSesion();

  const parsed = esquemaEditar.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre"),
    descripcion: String(formData.get("descripcion") ?? "") || undefined,
    aplicacion: String(formData.get("aplicacion") ?? "") || undefined,
    modelo: String(formData.get("modelo") ?? "") || undefined,
    tipo: String(formData.get("tipo") ?? "") || undefined,
    tamano: String(formData.get("tamano") ?? "") || undefined,
    visibleWeb: formData.get("visibleWeb") === "on",
    destacado: formData.get("destacado") === "on",
    quitarImagen: formData.get("quitarImagen") === "on",
  });

  if (!parsed.success) {
    redirect(`/panel/productos/${String(formData.get("id"))}/editar?error=datos`);
  }

  const datos = parsed.data;
  const actual = await prisma.producto.findUnique({ where: { id: datos.id } });
  if (!actual) redirect("/panel/productos");

  let imagenUrl = actual.imagenUrl;
  if (datos.quitarImagen && imagenUrl) {
    await eliminarImagenProducto(imagenUrl);
    imagenUrl = null;
  }

  try {
    const nueva = await guardarImagenProducto(formData, datos.id);
    if (nueva) {
      if (imagenUrl) await eliminarImagenProducto(imagenUrl);
      imagenUrl = nueva;
    }
  } catch {
    redirect(`/panel/productos/${datos.id}/editar?error=imagen`);
  }

  await prisma.producto.update({
    where: { id: datos.id },
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      aplicacion: datos.aplicacion ?? null,
      modelo: datos.modelo ?? null,
      tipo: datos.tipo ?? null,
      tamano: datos.tamano ?? null,
      visibleWeb: datos.visibleWeb,
      destacado: datos.destacado,
      imagenUrl,
    },
  });

  revalidatePath("/panel/productos");
  revalidatePath("/industrial");
  revalidatePath("/automotriz");
  redirect("/panel/productos");
}
