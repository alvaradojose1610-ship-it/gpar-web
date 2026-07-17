import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { EstructuraSitio } from "@/componentes/estructura/EstructuraSitio";
import { empresa } from "@/configuracion/empresa";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(empresa.urlSitio),
  title: {
    default: "Distribuidora GPar | Soluciones y productos industriales",
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
    title: "Distribuidora GPar | Soluciones y productos industriales",
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
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden font-sans">
        <EstructuraSitio>{children}</EstructuraSitio>
      </body>
    </html>
  );
}
