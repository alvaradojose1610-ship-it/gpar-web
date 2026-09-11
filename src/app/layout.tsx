import type { Metadata } from "next";
import {
  Barlow_Condensed,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import { ProveedorCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";
import { empresa } from "@/configuracion/empresa";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--gp-font-display",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--gp-font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--gp-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(empresa.urlSitio),
  title: {
    default: "Distribuidora GPar | Repuestos industriales y automotrices",
    template: "%s | Distribuidora GPar",
  },
  description: empresa.descripcion,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: empresa.urlSitio,
    siteName: empresa.nombreLegal,
    title: "Distribuidora GPar | Repuestos industriales y automotrices",
    description: empresa.descripcion,
    images: [
      {
        url: "/assets/identidad/logo-gpar.png",
        width: 512,
        height: 512,
        alt: empresa.nombreLegal,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#F57C00",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden font-sans">
        <ProveedorCotizacion>{children}</ProveedorCotizacion>
      </body>
    </html>
  );
}
