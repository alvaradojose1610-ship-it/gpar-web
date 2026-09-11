/**
 * Fotos de categoría en `public/assets/categorias/`.
 * Mezcla de fotos libres (Wikimedia Commons) y tomas generadas
 * alineadas al surtido industrial; sin logos de marca.
 */
export const imagenesCategorias: Record<string, string> = {
  rodamientos: "/assets/categorias/categoria-rodamientos.webp",
  chumaceras: "/assets/categorias/categoria-chumaceras.webp",
  correas: "/assets/categorias/categoria-correas.webp",
  poleas: "/assets/categorias/categoria-poleas.webp",
  "cadenas-pinones": "/assets/categorias/categoria-cadenas-pinones.webp",
  acoples: "/assets/categorias/categoria-acoples.webp",
  "sellos-mecanicos": "/assets/categorias/categoria-sellos-mecanicos.webp",
  "estoperas-industriales": "/assets/categorias/categoria-estoperas.webp",
  "mangueras-industriales": "/assets/categorias/categoria-mangueras.webp",
  "motores-reductores": "/assets/categorias/categoria-motores.webp",
  "ventiladores-axiales": "/assets/categorias/categoria-ventiladores.webp",
  "bandas-transportadoras": "/assets/categorias/categoria-bandas-transportadoras.webp",
  "guayas-cadenas-carga": "/assets/categorias/categoria-guayas.webp",
  "plasticos-industriales": "/assets/categorias/categoria-plasticos.webp",
  "productos-loctite": "/assets/categorias/categoria-adhesivos.webp",
};

export function imagenCategoria(codigo: string): string | undefined {
  return imagenesCategorias[codigo];
}
