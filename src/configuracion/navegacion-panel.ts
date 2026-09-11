import {
  CODIGOS_PERMISO,
  type CodigoPermiso,
} from "@/configuracion/permisos";

export type ItemNavegacionPanel = {
  href: string;
  etiqueta: string;
  exacto?: boolean;
  /** Si falta, el ítem es visible con solo panel.ver. */
  permiso: CodigoPermiso;
};

export const navegacionPanel: readonly ItemNavegacionPanel[] = [
  {
    href: "/panel",
    etiqueta: "Inicio",
    exacto: true,
    permiso: CODIGOS_PERMISO.PANEL_VER,
  },
  {
    href: "/panel/productos",
    etiqueta: "Productos",
    permiso: CODIGOS_PERMISO.PRODUCTOS_VER,
  },
  {
    href: "/panel/categorias",
    etiqueta: "Categorías",
    permiso: CODIGOS_PERMISO.CATEGORIAS_VER,
  },
  {
    href: "/panel/cotizaciones",
    etiqueta: "Cotizaciones",
    permiso: CODIGOS_PERMISO.COTIZACIONES_VER,
  },
  {
    href: "/panel/ventas",
    etiqueta: "Ventas",
    permiso: CODIGOS_PERMISO.VENTAS_VER,
  },
  {
    href: "/panel/caja",
    etiqueta: "Caja",
    permiso: CODIGOS_PERMISO.CAJA_VER,
  },
  {
    href: "/panel/compras",
    etiqueta: "Compras",
    permiso: CODIGOS_PERMISO.COMPRAS_VER,
  },
  {
    href: "/panel/inventario",
    etiqueta: "Inventario",
    permiso: CODIGOS_PERMISO.INVENTARIO_VER,
  },
  {
    href: "/panel/proveedores",
    etiqueta: "Proveedores",
    permiso: CODIGOS_PERMISO.PROVEEDORES_VER,
  },
  {
    href: "/panel/clientes",
    etiqueta: "Clientes",
    permiso: CODIGOS_PERMISO.CLIENTES_VER,
  },
  {
    href: "/panel/apartados",
    etiqueta: "Apartados",
    permiso: CODIGOS_PERMISO.APARTADOS_VER,
  },
  {
    href: "/panel/cuentas-por-cobrar",
    etiqueta: "CxC",
    permiso: CODIGOS_PERMISO.CUENTAS_VER,
  },
  {
    href: "/panel/cuentas-por-pagar",
    etiqueta: "CxP",
    permiso: CODIGOS_PERMISO.CUENTAS_VER,
  },
  {
    href: "/panel/usuarios",
    etiqueta: "Usuarios",
    permiso: CODIGOS_PERMISO.USUARIOS_VER,
  },
  {
    href: "/panel/configuracion",
    etiqueta: "Configuración",
    permiso: CODIGOS_PERMISO.PANEL_VER,
  },
] as const;

export function filtrarNavegacionPanel(
  permisos: readonly string[],
): ItemNavegacionPanel[] {
  const set = new Set(permisos);
  return navegacionPanel.filter((item) => set.has(item.permiso));
}
