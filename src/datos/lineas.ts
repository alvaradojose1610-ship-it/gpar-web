/**
 * Líneas de catálogo: slug público, valor Prisma y etiquetas.
 * INDUSTRIAL conserva el slug /industrial; solo cambia el nombre visible.
 */
export const LINEAS_CATALOGO = [
  {
    slug: "industrial",
    prisma: "INDUSTRIAL",
    etiqueta: "Rodamientos industriales",
    etiquetaNav: "Rodamientos",
    href: "/industrial",
    resumen:
      "Rodamientos, correas, chumaceras, motores y el resto del surtido industrial.",
  },
  {
    slug: "automatizacion",
    prisma: "AUTOMATIZACION",
    etiqueta: "Automatización industrial",
    etiquetaNav: "Automatización",
    href: "/automatizacion",
    resumen:
      "Componentes y equipos de automatización. Las categorías se publican desde el panel.",
  },
  {
    slug: "carga-pesada",
    prisma: "CARGA_PESADA",
    etiqueta: "Carga pesada",
    etiquetaNav: "Carga pesada",
    href: "/carga-pesada",
    resumen: "Rolinera, correas y más para taller y flota de carga pesada.",
  },
] as const;

export type LineaCatalogo = (typeof LINEAS_CATALOGO)[number]["slug"];
export type LineaPrisma = (typeof LINEAS_CATALOGO)[number]["prisma"];

export const VALORES_LINEA_PRISMA = [
  "INDUSTRIAL",
  "AUTOMATIZACION",
  "CARGA_PESADA",
] as const satisfies readonly LineaPrisma[];

export function lineaPorSlug(slug: string | undefined | null) {
  return LINEAS_CATALOGO.find((linea) => linea.slug === slug);
}

export function lineaPorPrisma(valor: string | undefined | null) {
  return LINEAS_CATALOGO.find((linea) => linea.prisma === valor);
}

export function etiquetaLinea(slug: string | undefined | null): string {
  return lineaPorSlug(slug)?.etiqueta ?? "Catálogo";
}

export function etiquetaLineaPrisma(valor: string | undefined | null): string {
  return lineaPorPrisma(valor)?.etiqueta ?? valor ?? "";
}
