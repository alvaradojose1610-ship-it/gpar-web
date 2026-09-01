import type { MetadataRoute } from "next";
import { empresa } from "@/configuracion/empresa";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${empresa.urlSitio}/sitemap.xml`,
    host: empresa.urlSitio,
  };
}
