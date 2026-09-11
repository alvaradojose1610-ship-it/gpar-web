import type { CategoriaCatalogo, ProductoCargaPesada } from "@/datos/tipos-catalogo";

/**
 * Categorías de carga pesada — propuestas del handoff.
 * Sin surtido cargado: publicada=false → UI "Próximamente" hasta confirmar.
 */
export const categoriasCargaPesada: CategoriaCatalogo[] = [
  {
    id: "rodamientos-rueda-masas",
    linea: "carga-pesada",
    nombre: "Rodamientos de rueda y masas",
    descripcion: "Rolinera, masas y kits de rueda.",
    publicada: false,
  },
  {
    id: "correas-kits-distribucion",
    linea: "carga-pesada",
    nombre: "Correas y kits de distribución",
    descripcion: "Correas de tiempo y kits completos.",
    publicada: false,
  },
  {
    id: "bandas-accesorios",
    linea: "carga-pesada",
    nombre: "Bandas de accesorios",
    descripcion: "Bandas poly-V y accesorios de motor.",
    publicada: false,
  },
  {
    id: "retenes-estoperas",
    linea: "carga-pesada",
    nombre: "Retenes y estoperas",
    descripcion: "Retenes de motor, caja y ejes.",
    publicada: false,
  },
  {
    id: "bombas-agua",
    linea: "carga-pesada",
    nombre: "Bombas de agua",
    descripcion: "Bombas y componentes de refrigeración.",
    publicada: false,
  },
  {
    id: "mangueras-abrazaderas",
    linea: "carga-pesada",
    nombre: "Mangueras y abrazaderas",
    descripcion: "Mangueras y fijaciones para carga pesada.",
    publicada: false,
  },
  {
    id: "kits-embrague",
    linea: "carga-pesada",
    nombre: "Kits de embrague",
    descripcion: "Discos, collares y kits completos.",
    publicada: false,
  },
  {
    id: "amortiguadores-suspension",
    linea: "carga-pesada",
    nombre: "Amortiguadores y suspensión",
    descripcion: "Amortiguadores y componentes de suspensión.",
    publicada: false,
  },
  {
    id: "frenos",
    linea: "carga-pesada",
    nombre: "Frenos",
    descripcion: "Pastillas, bandas y componentes de freno.",
    publicada: false,
  },
  {
    id: "filtros",
    linea: "carga-pesada",
    nombre: "Filtros",
    descripcion: "Filtros de aceite, aire, combustible y cabina.",
    publicada: false,
  },
];

/** Sin referencias reales todavía. Cargar cuando GPar entregue el surtido. */
export const productosCargaPesadaMuestra: ProductoCargaPesada[] = [];
