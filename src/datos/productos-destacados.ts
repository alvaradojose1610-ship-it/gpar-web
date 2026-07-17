export type ProductoDestacado = {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
};

export const productosDestacados: ProductoDestacado[] = [
  {
    id: "demo-001",
    codigo: "GP-DEMO-001",
    nombre: "Rodamiento de demostración",
    categoria: "Rodamientos",
    descripcion: "Referencia temporal para presentación del catálogo.",
  },
  {
    id: "demo-002",
    codigo: "GP-DEMO-002",
    nombre: "Correa industrial demostrativa",
    categoria: "Correas",
    descripcion: "Producto de ejemplo sin marca comercial asociada.",
  },
  {
    id: "demo-003",
    codigo: "GP-DEMO-003",
    nombre: "Polea de muestra",
    categoria: "Poleas",
    descripcion: "Ítem demostrativo para la estructura de fichas.",
  },
  {
    id: "demo-004",
    codigo: "GP-DEMO-004",
    nombre: "Motor de referencia",
    categoria: "Motores",
    descripcion: "Contenido provisional para validar el diseño.",
  },
  {
    id: "demo-005",
    codigo: "GP-DEMO-005",
    nombre: "Kit de herramientas demo",
    categoria: "Herramientas",
    descripcion: "Tarjeta de ejemplo para futuras referencias reales.",
  },
  {
    id: "demo-006",
    codigo: "GP-DEMO-006",
    nombre: "Lubricante de demostración",
    categoria: "Lubricantes",
    descripcion: "Producto simulado pendiente de catálogo definitivo.",
  },
];
