/**
 * Códigos de permiso del panel interno GPar.
 * Validar siempre en servidor (requerirPermiso), no solo en UI.
 */
export const CODIGOS_PERMISO = {
  PANEL_VER: "panel.ver",
  PRODUCTOS_VER: "productos.ver",
  PRODUCTOS_EDITAR: "productos.editar",
  CATEGORIAS_VER: "categorias.ver",
  CATEGORIAS_EDITAR: "categorias.editar",
  COTIZACIONES_VER: "cotizaciones.ver",
  COTIZACIONES_EDITAR: "cotizaciones.editar",
  VENTAS_VER: "ventas.ver",
  VENTAS_CREAR: "ventas.crear",
  COMPRAS_VER: "compras.ver",
  COMPRAS_EDITAR: "compras.editar",
  INVENTARIO_VER: "inventario.ver",
  INVENTARIO_EDITAR: "inventario.editar",
  PROVEEDORES_VER: "proveedores.ver",
  PROVEEDORES_EDITAR: "proveedores.editar",
  CLIENTES_VER: "clientes.ver",
  CLIENTES_EDITAR: "clientes.editar",
  CAJA_VER: "caja.ver",
  CAJA_EDITAR: "caja.editar",
  USUARIOS_VER: "usuarios.ver",
  USUARIOS_EDITAR: "usuarios.editar",
  APARTADOS_VER: "apartados.ver",
  APARTADOS_EDITAR: "apartados.editar",
  CUENTAS_VER: "cuentas.ver",
  CUENTAS_EDITAR: "cuentas.editar",
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
    codigo: CODIGOS_PERMISO.CATEGORIAS_VER,
    nombre: "Ver categorías",
    modulo: "categorias",
    descripcion: "Consultar categorías del catálogo",
  },
  {
    codigo: CODIGOS_PERMISO.CATEGORIAS_EDITAR,
    nombre: "Editar categorías",
    modulo: "categorias",
    descripcion: "Crear, publicar y ordenar categorías",
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
    codigo: CODIGOS_PERMISO.COMPRAS_EDITAR,
    nombre: "Editar compras",
    modulo: "compras",
    descripcion: "Registrar compras e ingresos de stock",
  },
  {
    codigo: CODIGOS_PERMISO.INVENTARIO_VER,
    nombre: "Ver inventario",
    modulo: "inventario",
    descripcion: "Consultar movimientos e inventario",
  },
  {
    codigo: CODIGOS_PERMISO.INVENTARIO_EDITAR,
    nombre: "Editar inventario",
    modulo: "inventario",
    descripcion: "Registrar ajustes de inventario",
  },
  {
    codigo: CODIGOS_PERMISO.PROVEEDORES_VER,
    nombre: "Ver proveedores",
    modulo: "proveedores",
    descripcion: "Consultar directorio de proveedores",
  },
  {
    codigo: CODIGOS_PERMISO.PROVEEDORES_EDITAR,
    nombre: "Editar proveedores",
    modulo: "proveedores",
    descripcion: "Crear y modificar proveedores",
  },
  {
    codigo: CODIGOS_PERMISO.CLIENTES_VER,
    nombre: "Ver clientes",
    modulo: "clientes",
    descripcion: "Consultar directorio de clientes",
  },
  {
    codigo: CODIGOS_PERMISO.CLIENTES_EDITAR,
    nombre: "Editar clientes",
    modulo: "clientes",
    descripcion: "Crear y modificar clientes",
  },
  {
    codigo: CODIGOS_PERMISO.CAJA_VER,
    nombre: "Ver caja",
    modulo: "caja",
    descripcion: "Consultar aperturas y movimientos de caja",
  },
  {
    codigo: CODIGOS_PERMISO.CAJA_EDITAR,
    nombre: "Editar caja",
    modulo: "caja",
    descripcion: "Abrir y cerrar caja",
  },
  {
    codigo: CODIGOS_PERMISO.USUARIOS_VER,
    nombre: "Ver usuarios",
    modulo: "usuarios",
    descripcion: "Consultar usuarios del sistema",
  },
  {
    codigo: CODIGOS_PERMISO.USUARIOS_EDITAR,
    nombre: "Editar usuarios",
    modulo: "usuarios",
    descripcion: "Crear usuarios, roles y permisos",
  },
  {
    codigo: CODIGOS_PERMISO.APARTADOS_VER,
    nombre: "Ver apartados",
    modulo: "apartados",
    descripcion: "Consultar reservas temporales de stock",
  },
  {
    codigo: CODIGOS_PERMISO.APARTADOS_EDITAR,
    nombre: "Editar apartados",
    modulo: "apartados",
    descripcion: "Crear, cancelar y convertir apartados",
  },
  {
    codigo: CODIGOS_PERMISO.CUENTAS_VER,
    nombre: "Ver cuentas",
    modulo: "cuentas",
    descripcion: "Consultar cuentas por cobrar y por pagar",
  },
  {
    codigo: CODIGOS_PERMISO.CUENTAS_EDITAR,
    nombre: "Editar cuentas",
    modulo: "cuentas",
    descripcion: "Registrar abonos y pagos",
  },
];

export function esCodigoPermiso(valor: string): valor is CodigoPermiso {
  return LISTA_PERMISOS.some((p) => p.codigo === valor);
}

/** Matrices de permisos por rol de sistema (seed). */
export const PERMISOS_POR_ROL_SISTEMA: Record<string, readonly CodigoPermiso[]> =
  {
    ADMINISTRADOR: LISTA_PERMISOS.map((p) => p.codigo),
    VENDEDOR: [
      CODIGOS_PERMISO.PANEL_VER,
      CODIGOS_PERMISO.PRODUCTOS_VER,
      CODIGOS_PERMISO.CATEGORIAS_VER,
      CODIGOS_PERMISO.COTIZACIONES_VER,
      CODIGOS_PERMISO.COTIZACIONES_EDITAR,
      CODIGOS_PERMISO.VENTAS_VER,
      CODIGOS_PERMISO.VENTAS_CREAR,
      CODIGOS_PERMISO.CLIENTES_VER,
      CODIGOS_PERMISO.CLIENTES_EDITAR,
      CODIGOS_PERMISO.CAJA_VER,
      CODIGOS_PERMISO.CAJA_EDITAR,
      CODIGOS_PERMISO.APARTADOS_VER,
      CODIGOS_PERMISO.APARTADOS_EDITAR,
      CODIGOS_PERMISO.CUENTAS_VER,
      CODIGOS_PERMISO.CUENTAS_EDITAR,
    ],
    ALMACEN: [
      CODIGOS_PERMISO.PANEL_VER,
      CODIGOS_PERMISO.PRODUCTOS_VER,
      CODIGOS_PERMISO.PRODUCTOS_EDITAR,
      CODIGOS_PERMISO.CATEGORIAS_VER,
      CODIGOS_PERMISO.CATEGORIAS_EDITAR,
      CODIGOS_PERMISO.COMPRAS_VER,
      CODIGOS_PERMISO.COMPRAS_EDITAR,
      CODIGOS_PERMISO.INVENTARIO_VER,
      CODIGOS_PERMISO.INVENTARIO_EDITAR,
      CODIGOS_PERMISO.PROVEEDORES_VER,
      CODIGOS_PERMISO.PROVEEDORES_EDITAR,
      CODIGOS_PERMISO.CUENTAS_VER,
    ],
    CONSULTA: [
      CODIGOS_PERMISO.PANEL_VER,
      CODIGOS_PERMISO.PRODUCTOS_VER,
      CODIGOS_PERMISO.CATEGORIAS_VER,
      CODIGOS_PERMISO.COTIZACIONES_VER,
      CODIGOS_PERMISO.VENTAS_VER,
      CODIGOS_PERMISO.COMPRAS_VER,
      CODIGOS_PERMISO.INVENTARIO_VER,
      CODIGOS_PERMISO.PROVEEDORES_VER,
      CODIGOS_PERMISO.CLIENTES_VER,
      CODIGOS_PERMISO.CAJA_VER,
      CODIGOS_PERMISO.APARTADOS_VER,
      CODIGOS_PERMISO.CUENTAS_VER,
    ],
  };
