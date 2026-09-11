import "server-only";

import { LineaNegocio, type Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { TAG_CATALOGO_PUBLICO } from "@/lib/imagen-producto-constantes";
import { prisma } from "@/lib/prisma";
import { imagenCategoria } from "@/datos/imagenes-categorias";
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

const selectProductoCatalogo = {
  id: true,
  codigo: true,
  nombre: true,
  descripcion: true,
  linea: true,
  modelo: true,
  subcategoria: true,
  aplicacion: true,
  especificaciones: true,
  tipo: true,
  tamano: true,
  posicion: true,
  vehiculo: true,
  anioDesde: true,
  anioHasta: true,
  imagenUrl: true,
  imagenThumbUrl: true,
  destacado: true,
  categoria: { select: { codigo: true, nombre: true } },
  marca: { select: { nombre: true } },
} satisfies Prisma.ProductoSelect;

type ProductoCatalogoFila = Prisma.ProductoGetPayload<{
  select: typeof selectProductoCatalogo;
}>;

/** Listados: thumb preferido. Ficha detalle puede usar imagenUrl completa. */
export function mapearProductoBd(
  p: ProductoCatalogoFila,
  opciones?: { preferirCompleta?: boolean },
): ProductoCatalogo {
  const imagen = opciones?.preferirCompleta
    ? (p.imagenUrl ?? p.imagenThumbUrl)
    : (p.imagenThumbUrl ?? p.imagenUrl);

  const base = {
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion ?? "",
    categoriaId: p.categoria.codigo,
    marca: p.marca?.nombre ?? null,
    aplicacion: p.aplicacion,
    destacado: p.destacado,
    imagen,
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
    select: {
      codigo: true,
      linea: true,
      nombre: true,
      descripcion: true,
      publicada: true,
      imagenUrl: true,
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return filas.map((c) => ({
    id: c.codigo,
    linea: enumALinea(c.linea),
    nombre: c.nombre,
    descripcion: c.descripcion ?? "",
    publicada: c.publicada,
    imagen: c.imagenUrl ?? imagenCategoria(c.codigo),
  }));
}

const LIMITE_LISTADO_DEFAULT = 120;

export async function listarProductosBd(opciones?: {
  linea?: LineaCatalogo;
  categoriaCodigo?: string;
  soloDestacados?: boolean;
  limite?: number;
}): Promise<ProductoCatalogo[]> {
  const take = opciones?.limite ?? LIMITE_LISTADO_DEFAULT;

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
    select: selectProductoCatalogo,
    orderBy: [{ destacado: "desc" }, { nombre: "asc" }],
    take,
  });

  return filas.map((p) => mapearProductoBd(p));
}

export async function contarProductosBd(opciones?: {
  linea?: LineaCatalogo;
  categoriaCodigo?: string;
}): Promise<number> {
  return prisma.producto.count({
    where: {
      estado: "ACTIVO",
      visibleWeb: true,
      ...(opciones?.linea ? { linea: lineaAEnum(opciones.linea) } : {}),
      ...(opciones?.categoriaCodigo
        ? { categoria: { codigo: opciones.categoriaCodigo } }
        : {}),
    },
  });
}

export async function buscarProductosBd(
  consulta: string,
): Promise<ProductoCatalogo[]> {
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
    select: selectProductoCatalogo,
    take: 60,
    orderBy: { nombre: "asc" },
  });

  return filas.map((p) => mapearProductoBd(p));
}

function claveCache(opciones: unknown) {
  return JSON.stringify(opciones ?? {});
}

/** Listados públicos cacheados ~5 min; se invalidan con updateTag al editar productos. */
export function listarCategoriasBdCache(linea?: LineaCatalogo) {
  return unstable_cache(
    () => listarCategoriasBd(linea),
    ["catalogo-categorias", claveCache(linea)],
    { tags: [TAG_CATALOGO_PUBLICO], revalidate: 300 },
  )();
}

export function listarProductosBdCache(opciones?: {
  linea?: LineaCatalogo;
  categoriaCodigo?: string;
  soloDestacados?: boolean;
  limite?: number;
}) {
  return unstable_cache(
    () => listarProductosBd(opciones),
    ["catalogo-productos", claveCache(opciones)],
    { tags: [TAG_CATALOGO_PUBLICO], revalidate: 300 },
  )();
}

export function contarProductosBdCache(opciones?: {
  linea?: LineaCatalogo;
  categoriaCodigo?: string;
}) {
  return unstable_cache(
    () => contarProductosBd(opciones),
    ["catalogo-conteo", claveCache(opciones)],
    { tags: [TAG_CATALOGO_PUBLICO], revalidate: 300 },
  )();
}
