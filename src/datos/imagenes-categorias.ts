/**
 * Fotos de categoría del paquete Claude (`gpar-assets-recortados.zip`).
 * Las fotos de catálogos impresos ajenos NO se usan en la web.
 */
export const imagenesCategorias: Record<string, string> = {
  rodamientos: "/assets/categorias/categoria-rodamientos.webp",
  chumaceras: "/assets/categorias/categoria-rodamientos.webp",
  correas: "/assets/categorias/categoria-correas.webp",
  poleas: "/assets/categorias/categoria-poleas.webp",
  "cadenas-pinones": "/assets/categorias/categoria-herramientas.webp",
  acoples: "/assets/categorias/categoria-herramientas.webp",
  "sellos-mecanicos": "/assets/categorias/categoria-lubricantes.webp",
  "estoperas-industriales": "/assets/categorias/categoria-lubricantes.webp",
  "mangueras-industriales": "/assets/categorias/categoria-hidraulica.webp",
  "motores-reductores": "/assets/categorias/categoria-motores.webp",
  "ventiladores-axiales": "/assets/categorias/categoria-neumatica.webp",
  "bandas-transportadoras": "/assets/categorias/categoria-correas.webp",
  "guayas-cadenas-carga": "/assets/categorias/categoria-seguridad-industrial.webp",
  "plasticos-industriales": "/assets/categorias/categoria-tornilleria.webp",
  "productos-loctite": "/assets/categorias/categoria-lubricantes.webp",
};

export function imagenCategoria(codigo: string): string | undefined {
  return imagenesCategorias[codigo];
}
