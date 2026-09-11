export type EnlaceNavegacion = {
  etiqueta: string;
  href: string;
};

export const navegacionPrincipal: EnlaceNavegacion[] = [
  { etiqueta: "Inicio", href: "/" },
  { etiqueta: "Industrial", href: "/industrial" },
  { etiqueta: "Automotriz", href: "/automotriz" },
  { etiqueta: "Contacto", href: "/cotizar" },
];

export const navegacionAccion = {
  etiqueta: "Solicitar cotización",
  href: "/cotizar",
} as const;
