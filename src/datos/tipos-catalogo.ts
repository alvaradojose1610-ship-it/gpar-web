/**
 * Modelo de catálogo GPar (español).
 * Preparado para sustituir datos simulados por inventario real / BD.
 */

export type LineaCatalogo = "industrial" | "carga-pesada";

export type CategoriaCatalogo = {
  id: string;
  linea: LineaCatalogo;
  nombre: string;
  descripcion: string;
  /** Si false, la UI puede mostrar "Próximamente". */
  publicada: boolean;
  subcategorias?: string[];
  /** Ruta pública o URL de foto de categoría. */
  imagen?: string;
};

/**
 * Campos comunes a cualquier referencia del catálogo.
 * Alineado a ficha de almacén + cotización web.
 */
export type ProductoBase = {
  id: string;
  linea: LineaCatalogo;
  categoriaId: string;
  /** Código interno GPar / del listado (ej. RO32207BS). */
  codigo: string;
  nombre: string;
  descripcion: string;
  marca?: string | null;
  /** Texto libre de aplicación o uso (como en el listado impreso). */
  aplicacion?: string | null;
  destacado?: boolean;
  /** Sin fotos reales: null hasta tener assets propios. */
  imagen?: string | null;
};

/**
 * Industrial — columnas del listado escaneado:
 * Código | Modelo | Descripción | Aplicación
 * + campos web útiles (marca, specs, subcategoría).
 */
export type ProductoIndustrial = ProductoBase & {
  linea: "industrial";
  /** Columna "Modelo" del listado; a menudo vacía. */
  modelo?: string | null;
  subcategoria?: string | null;
  /** Ej. DI 25mm · DE 52mm · Ancho 15mm */
  especificaciones?: string[];
};

/**
 * Carga pesada — lo pedido + lo necesario para búsqueda y venta.
 * nombre, tipo, marca, descripcion, tamaño
 * + codigo, aplicacion, posicion, vehiculo, años.
 */
export type ProductoCargaPesada = ProductoBase & {
  linea: "carga-pesada";
  /** Tipo de repuesto: rodamiento, correa, reten, etc. */
  tipo: string;
  marca: string;
  /** Medida / tamaño comercial (ej. 17x47x14, 6PK1890). */
  tamano?: string | null;
  /** Modelo interno o de fábrica si existe aparte del código. */
  modelo?: string | null;
  /** Posición en el vehículo: rueda trasera, diferencial, etc. */
  posicion?: string | null;
  /** Marca/modelo de vehículo o equipo (texto buscable). */
  vehiculo?: string | null;
  anioDesde?: number | null;
  anioHasta?: number | null;
};

export type ProductoCatalogo = ProductoIndustrial | ProductoCargaPesada;
