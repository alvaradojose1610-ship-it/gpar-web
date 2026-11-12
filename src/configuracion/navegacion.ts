import { LINEAS_CATALOGO } from "@/datos/lineas";

export type EnlaceNavegacion = {
  etiqueta: string;
  href: string;
};

export const navegacionPrincipal: EnlaceNavegacion[] = [
  { etiqueta: "Inicio", href: "/" },
  ...LINEAS_CATALOGO.map((linea) => ({
    etiqueta: linea.etiquetaNav,
    href: linea.href,
  })),
  { etiqueta: "Contacto", href: "/cotizar" },
];

export const navegacionAccion = {
  etiqueta: "Solicitar cotización",
  href: "/cotizar",
} as const;
