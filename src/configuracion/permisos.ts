/**
 * Códigos de permiso del panel interno GPar.
 * Validar siempre en servidor (requerirPermiso), no solo en UI.
 */
export const CODIGOS_PERMISO = {
  PANEL_VER: "panel.ver",
  PRODUCTOS_VER: "productos.ver",
  PRODUCTOS_EDITAR: "productos.editar",
  COTIZACIONES_VER: "cotizaciones.ver",
  COTIZACIONES_EDITAR: "cotizaciones.editar",
  VENTAS_VER: "ventas.ver",
  VENTAS_CREAR: "ventas.crear",
  COMPRAS_VER: "compras.ver",
  INVENTARIO_VER: "inventario.ver",
  USUARIOS_VER: "usuarios.ver",
} as const;

export type CodigoPermiso =
  (typeof CODIGOS_PERMISO)[keyof typeof CODIGOS_PERMISO];

export const LISTA_PERMISOS: ReadonlyArray<{
  codigo: CodigoPermiso;
  nombre: string;
  modulo: string;
  descripcion: string;
}> = [
  {
    codigo: CODIGOS_PERMISO.PANEL_VER,
    nombre: "Ver panel",
    modulo: "panel",
    descripcion: "Acceso al panel interno",
  },
  {
    codigo: CODIGOS_PERMISO.PRODUCTOS_VER,
    nombre: "Ver productos",
    modulo: "productos",
    descripcion: "Consultar catálogo de productos",
  },
  {
    codigo: CODIGOS_PERMISO.PRODUCTOS_EDITAR,
    nombre: "Editar productos",
    modulo: "productos",
    descripcion: "Crear y modificar productos",
  },
  {
    codigo: CODIGOS_PERMISO.COTIZACIONES_VER,
    nombre: "Ver cotizaciones",
    modulo: "cotizaciones",
    descripcion: "Consultar cotizaciones",
  },
  {
    codigo: CODIGOS_PERMISO.COTIZACIONES_EDITAR,
    nombre: "Editar cotizaciones",
    modulo: "cotizaciones",
    descripcion: "Gestionar y responder cotizaciones",
  },
  {
    codigo: CODIGOS_PERMISO.VENTAS_VER,
    nombre: "Ver ventas",
    modulo: "ventas",
    descripcion: "Consultar ventas",
  },
  {
    codigo: CODIGOS_PERMISO.VENTAS_CREAR,
    nombre: "Crear ventas",
    modulo: "ventas",
    descripcion: "Registrar ventas en POS",
  },
  {
    codigo: CODIGOS_PERMISO.COMPRAS_VER,
    nombre: "Ver compras",
    modulo: "compras",
    descripcion: "Consultar compras a proveedores",
  },
  {
    codigo: CODIGOS_PERMISO.INVENTARIO_VER,
    nombre: "Ver inventario",
    modulo: "inventario",
    descripcion: "Consultar movimientos e inventario",
  },
  {
    codigo: CODIGOS_PERMISO.USUARIOS_VER,
    nombre: "Ver usuarios",
    modulo: "usuarios",
    descripcion: "Consultar usuarios del sistema",
  },
];

export function esCodigoPermiso(valor: string): valor is CodigoPermiso {
  return LISTA_PERMISOS.some((p) => p.codigo === valor);
}
