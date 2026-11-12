import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { TAG_CATALOGO_PUBLICO } from "@/lib/imagen-producto-constantes";

export const TITULO_HERO_POR_DEFECTO =
  "Todo en\nTransmisión\nde potencia mecánica";

export const SUBTITULO_HERO_POR_DEFECTO =
  "Rodamientos, correas, chumaceras, motores, mangueras y repuestos de carga pesada. Arma tu lista y te cotizamos con precio, disponibilidad y tiempo de entrega.";

export type ContenidoHero = {
  tituloHero: string;
  subtituloHero: string;
};

async function leerContenidoHero(): Promise<ContenidoHero> {
  const config = await prisma.configuracionEmpresa.findFirst({
    where: { activo: true },
    select: { tituloHero: true, subtituloHero: true },
    orderBy: { creadoEn: "asc" },
  });

  return {
    tituloHero: config?.tituloHero?.trim() || TITULO_HERO_POR_DEFECTO,
    subtituloHero:
      config?.subtituloHero?.trim() || SUBTITULO_HERO_POR_DEFECTO,
  };
}

export async function obtenerContenidoHero(): Promise<ContenidoHero> {
  try {
    return await unstable_cache(leerContenidoHero, ["contenido-hero"], {
      tags: [TAG_CATALOGO_PUBLICO],
      revalidate: 300,
    })();
  } catch {
    return {
      tituloHero: TITULO_HERO_POR_DEFECTO,
      subtituloHero: SUBTITULO_HERO_POR_DEFECTO,
    };
  }
}

export async function obtenerConfiguracionEmpresaActiva() {
  return prisma.configuracionEmpresa.findFirst({
    where: { activo: true },
    orderBy: { creadoEn: "asc" },
  });
}
