import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaPanelCompras() {
  await requerirPermiso(CODIGOS_PERMISO.COMPRAS_VER, "/panel/compras");

  const compras = await prisma.compra.findMany({
    orderBy: { creadoEn: "desc" },
    take: 100,
    include: {
      proveedor: { select: { razonSocial: true } },
      _count: { select: { detalles: true } },
    },
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Compras"
      descripcion="Compras a proveedores con entrada de inventario."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5C6675]">{compras.length} recientes</p>
        <Link
          href="/panel/compras/nueva"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          + Nueva compra
        </Link>
      </div>

      {compras.length === 0 ? (
        <p className="border border-dashed border-[#E4E7EC] bg-white px-4 py-8 text-center text-sm text-[#5C6675]">
          Todavía no hay compras registradas.
        </p>
      ) : (
        <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
              <tr>
                <th className="px-3 py-2 font-semibold">Número</th>
                <th className="px-3 py-2 font-semibold">Proveedor</th>
                <th className="px-3 py-2 font-semibold">Ítems</th>
                <th className="px-3 py-2 font-semibold">Total</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 font-semibold">Fecha</th>
                <th className="px-3 py-2 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-3 py-2 font-mono text-xs text-[#1D2430]">
                    {c.numero}
                  </td>
                  <td className="px-3 py-2 text-[#1D2430]">
                    {c.proveedor.razonSocial}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {c._count.detalles}
                  </td>
                  <td className="px-3 py-2 text-[#1D2430]">
                    {Number(c.total).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {c.estadoDocumento}
                  </td>
                  <td className="px-3 py-2 text-xs text-[#8A94A2]">
                    {c.fecha.toLocaleString("es-VE")}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={`/panel/compras/${c.id}`}
                      className="text-sm font-semibold text-[#D96A00] hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PaginaPlaceholderPanel>
  );
}
