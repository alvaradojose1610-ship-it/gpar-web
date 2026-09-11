import "server-only";

import { LineaNegocio, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  CategoriaCatalogo,
  LineaCatalogo,
  ProductoCatalogo,
} from "@/datos/tipos-catalogo";

function lineaAEnum(linea: LineaCatalogo): LineaNegocio {
  return linea === "automotriz"
    ? LineaNegocio.AUTOMOTRIZ
    : LineaNegocio.INDUSTRIAL;
}

function enumALinea(linea: LineaNegocio): LineaCatalogo {
  return linea === LineaNegocio.AUTOMOTRIZ ? "automotriz" : "industrial";
}

type ProductoConRelaciones = Prisma.ProductoGetPayload<{
  include: { categoria: true; marca: true };
}>;

export function mapearProductoBd(p: ProductoConRelaciones): ProductoCatalogo {
  const base = {
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion ?? "",
    categoriaId: p.categoria.codigo,
    marca: p.marca?.nombre ?? null,
    aplicacion: p.aplicacion,
    destacado: p.destacado,
    imagen: p.imagenUrl,
  };

  if (p.linea === LineaNegocio.AUTOMOTRIZ) {
    return {
      ...base,
      linea: "automotriz",
      tipo: p.tipo ?? p.categoria.nombre,
      marca: p.marca?.nombre ?? "Por confirmar",
      tamano: p.tamano,
      modelo: p.modelo,
      posicion: p.posicion,
      vehiculo: p.vehiculo,
      anioDesde: p.anioDesde,
      anioHasta: p.anioHasta,
    };
  }

  const specs = Array.isArray(p.especificaciones)
    ? (p.especificaciones as string[])
    : undefined;

  return {
    ...base,
    linea: "industrial",
    modelo: p.modelo,
    subcategoria: p.subcategoria,
    especificaciones: specs,
  };
}

export async function listarCategoriasBd(
  linea?: LineaCatalogo,
): Promise<CategoriaCatalogo[]> {
  const filas = await prisma.categoria.findMany({
    where: {
      estado: "ACTIVO",
      ...(linea ? { linea: lineaAEnum(linea) } : {}),
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return filas.map((c) => ({
    id: c.codigo,
    linea: enumALinea(c.linea),
    nombre: c.nombre,
    descripcion: c.descripcion ?? "",
    publicada: c.publicada,
  }));
}

export async function listarProductosBd(opciones?: {
  linea?: LineaCatalogo;
  categoriaCodigo?: string;
  soloDestacados?: boolean;
  limite?: number;
}): Promise<ProductoCatalogo[]> {
  const filas = await prisma.producto.findMany({
    where: {
      estado: "ACTIVO",
      visibleWeb: true,
      ...(opciones?.linea ? { linea: lineaAEnum(opciones.linea) } : {}),
      ...(opciones?.categoriaCodigo
        ? { categoria: { codigo: opciones.categoriaCodigo } }
        : {}),
      ...(opciones?.soloDestacados ? { destacado: true } : {}),
    },
    include: { categoria: true, marca: true },
    orderBy: [{ destacado: "desc" }, { nombre: "asc" }],
    take: opciones?.limite,
  });

  return filas.map(mapearProductoBd);
}

export async function buscarProductosBd(consulta: string): Promise<ProductoCatalogo[]> {
  const q = consulta.trim();
  if (!q) return [];

  const filas = await prisma.producto.findMany({
    where: {
      estado: "ACTIVO",
      visibleWeb: true,
      OR: [
        { codigo: { contains: q, mode: "insensitive" } },
        { nombre: { contains: q, mode: "insensitive" } },
        { descripcion: { contains: q, mode: "insensitive" } },
        { aplicacion: { contains: q, mode: "insensitive" } },
        { vehiculo: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { categoria: true, marca: true },
    take: 60,
    orderBy: { nombre: "asc" },
  });

  return filas.map(mapearProductoBd);
}
