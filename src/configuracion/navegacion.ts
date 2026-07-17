export type EnlaceNavegacion = {
  etiqueta: string;
  href: string;
};

export const navegacionPrincipal: EnlaceNavegacion[] = [
  { etiqueta: "Productos", href: "/#productos" },
  { etiqueta: "Categorías", href: "/#categorias" },
  { etiqueta: "Marcas", href: "/#marcas" },
  { etiqueta: "Empresa", href: "/#empresa" },
  { etiqueta: "Contacto", href: "/#contacto" },
];

export const navegacionAccion = {
  etiqueta: "Solicitar cotización",
  href: "/#cotizacion",
} as const;
