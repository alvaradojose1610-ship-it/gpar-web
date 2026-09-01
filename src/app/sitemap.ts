import type { MetadataRoute } from "next";
import { empresa } from "@/configuracion/empresa";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: empresa.urlSitio,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
