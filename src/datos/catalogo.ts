import {
  categoriasCargaPesada,
  productosCargaPesadaMuestra,
} from "@/datos/catalogo-carga-pesada";
import {
  categoriasIndustriales,
  productosIndustrialesMuestra,
} from "@/datos/catalogo-industrial";
import type {
  CategoriaCatalogo,
  LineaCatalogo,
  ProductoCatalogo,
} from "@/datos/tipos-catalogo";

export const categoriasCatalogo: CategoriaCatalogo[] = [
  ...categoriasIndustriales,
  ...categoriasCargaPesada,
];

export const productosCatalogo: ProductoCatalogo[] = [
  ...productosIndustrialesMuestra,
  ...productosCargaPesadaMuestra,
];

export function categoriasPorLinea(linea: LineaCatalogo): CategoriaCatalogo[] {
  return categoriasCatalogo.filter((categoria) => categoria.linea === linea);
}

export function productosPorCategoria(
  linea: LineaCatalogo,
  categoriaId: string,
): ProductoCatalogo[] {
  return productosCatalogo.filter(
    (producto) => producto.linea === linea && producto.categoriaId === categoriaId,
  );
}

export function productosDestacadosCatalogo(limite = 8): ProductoCatalogo[] {
  const destacados = productosCatalogo.filter((producto) => producto.destacado);
  if (destacados.length >= limite) {
    return destacados.slice(0, limite);
  }
  return [...destacados, ...productosCatalogo.filter((p) => !p.destacado)].slice(
    0,
    limite,
  );
}

export function buscarProductos(consulta: string): ProductoCatalogo[] {
  const q = consulta.trim().toLowerCase();
  if (!q) return [];

  return productosCatalogo.filter((producto) => {
    const campos = [
      producto.codigo,
      producto.nombre,
      producto.descripcion,
      producto.aplicacion ?? "",
      producto.marca ?? "",
      "modelo" in producto ? (producto.modelo ?? "") : "",
      "tipo" in producto ? producto.tipo : "",
      "tamano" in producto ? (producto.tamano ?? "") : "",
      "vehiculo" in producto ? (producto.vehiculo ?? "") : "",
      "posicion" in producto ? (producto.posicion ?? "") : "",
    ];
    return campos.some((campo) => campo.toLowerCase().includes(q));
  });
}

export function categoriaPorId(
  linea: LineaCatalogo,
  categoriaId: string,
): CategoriaCatalogo | undefined {
  return categoriasCatalogo.find(
    (categoria) => categoria.linea === linea && categoria.id === categoriaId,
  );
}

export function contarProductosPorCategoria(
  linea: LineaCatalogo,
  categoriaId: string,
): number {
  return productosPorCategoria(linea, categoriaId).length;
}

export function totalReferenciasPorLinea(linea: LineaCatalogo): number {
  return productosCatalogo.filter((producto) => producto.linea === linea)
    .length;
}
