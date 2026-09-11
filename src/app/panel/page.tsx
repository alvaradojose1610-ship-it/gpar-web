import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO, type CodigoPermiso } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import {
  requerirPermiso,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaPanelInicio() {
  const sesion = await requerirPermiso(CODIGOS_PERMISO.PANEL_VER, "/panel");

  const [productos, cotizaciones, cotizacionesNuevas] = await Promise.all([
    prisma.producto.count({ where: { estado: "ACTIVO" } }),
    prisma.cotizacion.count(),
    prisma.cotizacion.count({ where: { estado: "RECIBIDA" } }),
  ]);

  const cards: Array<{
    href: string;
    titulo: string;
    detalle: string;
    permiso: CodigoPermiso;
  }> = [
    {
      href: "/panel/productos",
      titulo: "Productos",
      detalle: `${productos} referencias activas`,
      permiso: CODIGOS_PERMISO.PRODUCTOS_VER,
    },
    {
      href: "/panel/cotizaciones",
      titulo: "Cotizaciones",
      detalle:
        cotizaciones === 0
          ? "Sin solicitudes aún"
          : `${cotizaciones} total · ${cotizacionesNuevas} recibidas`,
      permiso: CODIGOS_PERMISO.COTIZACIONES_VER,
    },
    {
      href: "/panel/ventas",
      titulo: "Ventas",
      detalle: "POS e historial de ventas",
      permiso: CODIGOS_PERMISO.VENTAS_VER,
    },
    {
      href: "/panel/inventario",
      titulo: "Inventario",
      detalle: "Stock y movimientos",
      permiso: CODIGOS_PERMISO.INVENTARIO_VER,
    },
    {
      href: "/panel/categorias",
      titulo: "Categorías",
      detalle: "Publicación del catálogo web",
      permiso: CODIGOS_PERMISO.CATEGORIAS_VER,
    },
    {
      href: "/panel/usuarios",
      titulo: "Usuarios",
      detalle: "Cuentas, roles y permisos",
      permiso: CODIGOS_PERMISO.USUARIOS_VER,
    },
  ];

  const visibles = cards.filter((c) => tienePermiso(sesion, c.permiso));

  return (
    <PaginaPlaceholderPanel
      titulo="Inicio"
      descripcion="Panel interno de Distribuidora GPar — catálogo, cotizaciones y operación."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {visibles.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-[#E4E7EC] bg-white p-4 outline-none transition hover:border-[#F57C00] focus-visible:ring-2 focus-visible:ring-[#D96A00]"
          >
            <h2 className="text-base font-semibold text-[#1D2430]">
              {card.titulo}
            </h2>
            <p className="mt-1 text-sm text-[#5C6675]">{card.detalle}</p>
          </Link>
        ))}
      </div>
    </PaginaPlaceholderPanel>
  );
}
