import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaPanelInicio() {
  await requerirSesion();

  const [productos, cotizaciones, cotizacionesNuevas] = await Promise.all([
    prisma.producto.count({ where: { estado: "ACTIVO" } }),
    prisma.cotizacion.count(),
    prisma.cotizacion.count({ where: { estado: "RECIBIDA" } }),
  ]);

  const cards = [
    {
      href: "/panel/productos",
      titulo: "Productos",
      detalle: `${productos} referencias activas`,
    },
    {
      href: "/panel/cotizaciones",
      titulo: "Cotizaciones",
      detalle:
        cotizaciones === 0
          ? "Sin solicitudes aún"
          : `${cotizaciones} total · ${cotizacionesNuevas} recibidas`,
    },
    {
      href: "/panel/ventas",
      titulo: "Ventas",
      detalle: "POS e historial (siguiente fase)",
    },
    {
      href: "/panel/inventario",
      titulo: "Inventario",
      detalle: "Movimientos y stock (siguiente fase)",
    },
  ];

  return (
    <PaginaPlaceholderPanel
      titulo="Inicio"
      descripcion="Panel interno de Distribuidora GPar — catálogo, cotizaciones y operación."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
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
