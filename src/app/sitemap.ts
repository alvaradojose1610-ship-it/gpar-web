import type { MetadataRoute } from "next";
import { empresa } from "@/configuracion/empresa";
import { categoriasCatalogo } from "@/datos/catalogo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = empresa.urlSitio.replace(/\/$/, "");
  const ahora = new Date();

  const categorias = categoriasCatalogo
    .filter((c) => c.publicada)
    .map((c) => ({
      url: `${base}/${c.linea}/${c.id}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: base,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/industrial`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/carga-pesada`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/buscar`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/cotizar`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...categorias,
  ];
}
