import type { CategoriaCatalogo, ProductoAutomotriz } from "@/datos/tipos-catalogo";

/**
 * Categorías automotrices — propuestas del handoff.
 * Sin surtido cargado: publicada=false → UI "Próximamente" hasta confirmar.
 */
export const categoriasAutomotrices: CategoriaCatalogo[] = [
  {
    id: "rodamientos-rueda-masas",
    linea: "automotriz",
    nombre: "Rodamientos de rueda y masas",
    descripcion: "Rolinera, masas y kits de rueda.",
    publicada: false,
  },
  {
    id: "correas-kits-distribucion",
    linea: "automotriz",
    nombre: "Correas y kits de distribución",
    descripcion: "Correas de tiempo y kits completos.",
    publicada: false,
  },
  {
    id: "bandas-accesorios",
    linea: "automotriz",
    nombre: "Bandas de accesorios",
    descripcion: "Bandas poly-V y accesorios de motor.",
    publicada: false,
  },
  {
    id: "retenes-estoperas",
    linea: "automotriz",
    nombre: "Retenes y estoperas",
    descripcion: "Retenes de motor, caja y ejes.",
    publicada: false,
  },
  {
    id: "bombas-agua",
    linea: "automotriz",
    nombre: "Bombas de agua",
    descripcion: "Bombas y componentes de refrigeración.",
    publicada: false,
  },
  {
    id: "mangueras-abrazaderas",
    linea: "automotriz",
    nombre: "Mangueras y abrazaderas",
    descripcion: "Mangueras automotrices y fijaciones.",
    publicada: false,
  },
  {
    id: "kits-embrague",
    linea: "automotriz",
    nombre: "Kits de embrague",
    descripcion: "Discos, collares y kits completos.",
    publicada: false,
  },
  {
    id: "amortiguadores-suspension",
    linea: "automotriz",
    nombre: "Amortiguadores y suspensión",
    descripcion: "Amortiguadores y componentes de suspensión.",
    publicada: false,
  },
  {
    id: "frenos",
    linea: "automotriz",
    nombre: "Frenos",
    descripcion: "Pastillas, bandas y componentes de freno.",
    publicada: false,
  },
  {
    id: "filtros",
    linea: "automotriz",
    nombre: "Filtros",
    descripcion: "Filtros de aceite, aire, combustible y cabina.",
    publicada: false,
  },
];

/** Sin referencias reales todavía. Cargar cuando GPar entregue el surtido. */
export const productosAutomotricesMuestra: ProductoAutomotriz[] = [];
