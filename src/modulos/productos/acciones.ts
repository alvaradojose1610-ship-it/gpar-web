"use server";

import { LineaNegocio } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { TAG_CATALOGO_PUBLICO } from "@/lib/imagen-producto-constantes";
import {
  eliminarImagenesProducto,
  guardarImagenProducto,
} from "@/lib/imagen-producto";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

const esquema = z.object({
  codigo: z.string().trim().min(2).max(64),
  nombre: z.string().trim().min(2).max(200),
  linea: z.enum(["INDUSTRIAL", "CARGA_PESADA"]),
  categoriaId: z.string().min(1),
  descripcion: z.string().trim().max(2000).optional(),
  aplicacion: z.string().trim().max(500).optional(),
  modelo: z.string().trim().max(120).optional(),
  tipo: z.string().trim().max(120).optional(),
  tamano: z.string().trim().max(120).optional(),
  visibleWeb: z.boolean().default(true),
});

export async function accionCrearProducto(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.PRODUCTOS_EDITAR);

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
  const categoria = await categoriaDeLinea(
    datos.categoriaId,
    datos.linea as LineaNegocio,
  );
  if (!categoria) {
    redirect("/panel/productos/nuevo?error=datos");
  }

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
    const subida = await guardarImagenProducto(formData, producto.id);
    if (subida) {
      await prisma.producto.update({
        where: { id: producto.id },
        data: {
          imagenUrl: subida.url,
          imagenThumbUrl: subida.thumbUrl,
        },
      });
    }
  } catch {
    // Producto queda sin imagen; se puede editar después
  }

  await revalidarCatalogoPublico(
    producto.linea,
    categoria.codigo,
    producto.tokenPublico,
  );
  redirect("/panel/productos");
}

async function categoriaDeLinea(categoriaId: string, linea: LineaNegocio) {
  return prisma.categoria.findFirst({
    where: { id: categoriaId, linea },
    select: { id: true, codigo: true },
  });
}

async function revalidarCatalogoPublico(
  linea: LineaNegocio,
  categoriaCodigo: string,
  tokenPublico?: string,
) {
  const lineaPath =
    linea === LineaNegocio.CARGA_PESADA ? "carga-pesada" : "industrial";

  updateTag(TAG_CATALOGO_PUBLICO);
  revalidatePath("/panel/productos");
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath(`/${lineaPath}`);
  revalidatePath(`/${lineaPath}/${categoriaCodigo}`);
  revalidatePath(`/${lineaPath}`, "layout");
  if (tokenPublico) {
    revalidatePath(`/p/${tokenPublico}`);
  }
}

const esquemaEditar = z.object({
  id: z.string().min(1),
  nombre: z.string().trim().min(2).max(200),
  linea: z.enum(["INDUSTRIAL", "CARGA_PESADA"]),
  categoriaId: z.string().min(1),
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
  await requerirPermiso(CODIGOS_PERMISO.PRODUCTOS_EDITAR);

  const parsed = esquemaEditar.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre"),
    linea: formData.get("linea"),
    categoriaId: formData.get("categoriaId"),
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
  const actual = await prisma.producto.findUnique({
    where: { id: datos.id },
    select: {
      id: true,
      tokenPublico: true,
      imagenUrl: true,
      imagenThumbUrl: true,
    },
  });
  if (!actual) redirect("/panel/productos");

  const categoria = await categoriaDeLinea(
    datos.categoriaId,
    datos.linea as LineaNegocio,
  );
  if (!categoria) {
    redirect(`/panel/productos/${datos.id}/editar?error=datos`);
  }

  let imagenUrl = actual.imagenUrl;
  let imagenThumbUrl = actual.imagenThumbUrl;

  if (datos.quitarImagen && (imagenUrl || imagenThumbUrl)) {
    await eliminarImagenesProducto(imagenUrl, imagenThumbUrl);
    imagenUrl = null;
    imagenThumbUrl = null;
  }

  try {
    const nueva = await guardarImagenProducto(formData, datos.id);
    if (nueva) {
      await eliminarImagenesProducto(imagenUrl, imagenThumbUrl);
      imagenUrl = nueva.url;
      imagenThumbUrl = nueva.thumbUrl;
    }
  } catch {
    redirect(`/panel/productos/${datos.id}/editar?error=imagen`);
  }

  await prisma.producto.update({
    where: { id: datos.id },
    data: {
      nombre: datos.nombre,
      linea: datos.linea as LineaNegocio,
      categoriaId: datos.categoriaId,
      descripcion: datos.descripcion ?? null,
      aplicacion: datos.aplicacion ?? null,
      modelo: datos.modelo ?? null,
      tipo: datos.tipo ?? null,
      tamano: datos.tamano ?? null,
      visibleWeb: datos.visibleWeb,
      destacado: datos.destacado,
      imagenUrl,
      imagenThumbUrl,
    },
  });

  await revalidarCatalogoPublico(
    datos.linea as LineaNegocio,
    categoria.codigo,
    actual.tokenPublico,
  );
  redirect("/panel/productos");
}
