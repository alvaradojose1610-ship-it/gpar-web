import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import {
  categoriasCatalogo as categoriasLocales,
  productosCatalogo as productosLocales,
  buscarProductos as buscarLocal,
  categoriaPorId as categoriaLocal,
  categoriasPorLinea as categoriasLineaLocal,
  contarProductosPorCategoria as contarLocal,
  productosDestacadosCatalogo as destacadosLocal,
  productosPorCategoria as productosCatLocal,
  totalReferenciasPorLinea as totalLocal,
} from "@/datos/catalogo";
import type {
  CategoriaCatalogo,
  LineaCatalogo,
  ProductoCatalogo,
} from "@/datos/tipos-catalogo";
import {
  buscarProductosBd,
  listarCategoriasBd,
  listarProductosBd,
} from "@/modulos/catalogo/servicio-catalogo";
import { imagenCategoria } from "@/datos/imagenes-categorias";

async function conFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  noStore();
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function obtenerCategoriasPorLinea(
  linea: LineaCatalogo,
): Promise<CategoriaCatalogo[]> {
  return conFallback(async () => {
    const filas = await listarCategoriasBd(linea);
    if (filas.length > 0) return filas;
    return categoriasLineaLocal(linea).map((c) => ({
      ...c,
      imagen: imagenCategoria(c.id) ?? c.imagen,
    }));
  }, categoriasLineaLocal(linea).map((c) => ({
    ...c,
    imagen: imagenCategoria(c.id) ?? c.imagen,
  })));
}

export async function obtenerCategoria(
  linea: LineaCatalogo,
  categoriaId: string,
): Promise<CategoriaCatalogo | undefined> {
  return conFallback(async () => {
    const filas = await listarCategoriasBd(linea);
    const encontrada = filas.find((c) => c.id === categoriaId);
    return encontrada ?? categoriaLocal(linea, categoriaId);
  }, categoriaLocal(linea, categoriaId));
}

export async function obtenerProductosPorCategoria(
  linea: LineaCatalogo,
  categoriaId: string,
): Promise<ProductoCatalogo[]> {
  return conFallback(async () => {
    const filas = await listarProductosBd({
      linea,
      categoriaCodigo: categoriaId,
    });
    return filas.length > 0
      ? filas
      : productosCatLocal(linea, categoriaId);
  }, productosCatLocal(linea, categoriaId));
}

export async function obtenerProductosDestacados(
  limite = 8,
): Promise<ProductoCatalogo[]> {
  return conFallback(async () => {
    const destacados = await listarProductosBd({
      soloDestacados: true,
      limite,
    });
    if (destacados.length > 0) return destacados;
    const todos = await listarProductosBd({ limite });
    return todos.length > 0 ? todos : destacadosLocal(limite);
  }, destacadosLocal(limite));
}

export async function obtenerBusqueda(
  consulta: string,
): Promise<ProductoCatalogo[]> {
  return conFallback(
    () => buscarProductosBd(consulta),
    buscarLocal(consulta),
  );
}

export async function contarEnCategoria(
  linea: LineaCatalogo,
  categoriaId: string,
): Promise<number> {
  const productos = await obtenerProductosPorCategoria(linea, categoriaId);
  return productos.length;
}

export async function totalPorLinea(linea: LineaCatalogo): Promise<number> {
  return conFallback(async () => {
    const filas = await listarProductosBd({ linea });
    return filas.length > 0 ? filas.length : totalLocal(linea);
  }, totalLocal(linea));
}

/** Catálogo plano para el cliente (cotización / drawer). */
export async function obtenerCatalogoCliente(): Promise<ProductoCatalogo[]> {
  return conFallback(async () => {
    const filas = await listarProductosBd({ limite: 500 });
    return filas.length > 0 ? filas : productosLocales;
  }, productosLocales);
}

export { categoriasLocales, productosLocales };
