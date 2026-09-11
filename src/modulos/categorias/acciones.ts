"use server";

import { LineaNegocio } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import {
  eliminarImagenProducto,
  guardarImagenProducto,
} from "@/lib/imagen-producto";
import { TAG_CATALOGO_PUBLICO } from "@/lib/imagen-producto-constantes";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

function slugCodigo(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

const esquema = z.object({
  linea: z.enum(["INDUSTRIAL", "CARGA_PESADA"]),
  codigo: z.string().trim().min(2).max(64),
  nombre: z.string().trim().min(2).max(120),
  descripcion: z.string().trim().max(500).optional(),
  publicada: z.boolean(),
  orden: z.coerce.number().int().min(0).max(9999),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

function invalidarCatalogo(categoriaId?: string) {
  updateTag(TAG_CATALOGO_PUBLICO);
  revalidatePath("/industrial");
  revalidatePath("/carga-pesada");
  revalidatePath("/panel/categorias");
  revalidatePath("/panel/productos");
  if (categoriaId) {
    revalidatePath(`/panel/categorias/${categoriaId}/editar`);
  }
}

async function subirImagenCategoria(formData: FormData, categoriaId: string) {
  return guardarImagenProducto(formData, categoriaId, {
    carpeta: "categorias",
  });
}

export async function accionCrearCategoria(formData: FormData) {
  await requerirPermiso(
    CODIGOS_PERMISO.CATEGORIAS_EDITAR,
    "/panel/categorias",
  );

  const codigoRaw = String(formData.get("codigo") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "");
  const parsed = esquema.safeParse({
    linea: formData.get("linea"),
    codigo: codigoRaw || slugCodigo(nombre),
    nombre,
    descripcion: String(formData.get("descripcion") ?? "") || undefined,
    publicada: formData.get("publicada") === "on",
    orden: formData.get("orden") || 0,
    estado: formData.get("estado") === "INACTIVO" ? "INACTIVO" : "ACTIVO",
  });

  if (!parsed.success) {
    redirect("/panel/categorias/nueva?error=datos");
  }

  const datos = parsed.data;
  const codigo = slugCodigo(datos.codigo);
  if (!codigo) {
    redirect("/panel/categorias/nueva?error=datos");
  }

  const existe = await prisma.categoria.findUnique({
    where: {
      linea_codigo: {
        linea: datos.linea as LineaNegocio,
        codigo,
      },
    },
  });
  if (existe) {
    redirect("/panel/categorias/nueva?error=codigo");
  }

  const categoria = await prisma.categoria.create({
    data: {
      linea: datos.linea as LineaNegocio,
      codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      publicada: datos.publicada,
      orden: datos.orden,
      estado: datos.estado,
    },
  });

  try {
    const subida = await subirImagenCategoria(formData, categoria.id);
    if (subida) {
      await prisma.categoria.update({
        where: { id: categoria.id },
        data: { imagenUrl: subida.url },
      });
    }
  } catch {
    invalidarCatalogo();
    redirect(`/panel/categorias/${categoria.id}/editar?error=imagen`);
  }

  invalidarCatalogo();
  redirect("/panel/categorias?ok=creada");
}

export async function accionActualizarCategoria(formData: FormData) {
  await requerirPermiso(
    CODIGOS_PERMISO.CATEGORIAS_EDITAR,
    "/panel/categorias",
  );

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/categorias?error=datos");

  const parsed = esquema.safeParse({
    linea: formData.get("linea"),
    codigo: formData.get("codigo"),
    nombre: formData.get("nombre"),
    descripcion: String(formData.get("descripcion") ?? "") || undefined,
    publicada: formData.get("publicada") === "on",
    orden: formData.get("orden") || 0,
    estado: formData.get("estado") === "INACTIVO" ? "INACTIVO" : "ACTIVO",
  });

  if (!parsed.success) {
    redirect(`/panel/categorias/${id}/editar?error=datos`);
  }

  const datos = parsed.data;
  const codigo = slugCodigo(datos.codigo);
  const actual = await prisma.categoria.findUnique({ where: { id } });
  if (!actual) redirect("/panel/categorias?error=datos");

  const conflicto = await prisma.categoria.findFirst({
    where: {
      linea: datos.linea as LineaNegocio,
      codigo,
      id: { not: id },
    },
  });
  if (conflicto) {
    redirect(`/panel/categorias/${id}/editar?error=codigo`);
  }

  let imagenUrl = actual.imagenUrl;
  const quitarImagen = formData.get("quitarImagen") === "on";

  try {
    if (quitarImagen && imagenUrl) {
      await eliminarImagenProducto(imagenUrl);
      imagenUrl = null;
    }
    const nueva = await subirImagenCategoria(formData, id);
    if (nueva) {
      if (imagenUrl && imagenUrl !== nueva.url) {
        await eliminarImagenProducto(imagenUrl);
      }
      imagenUrl = nueva.url;
    }
  } catch {
    redirect(`/panel/categorias/${id}/editar?error=imagen`);
  }

  await prisma.categoria.update({
    where: { id },
    data: {
      linea: datos.linea as LineaNegocio,
      codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      publicada: datos.publicada,
      orden: datos.orden,
      estado: datos.estado,
      imagenUrl,
    },
  });

  invalidarCatalogo(id);
  redirect("/panel/categorias?ok=actualizada");
}
