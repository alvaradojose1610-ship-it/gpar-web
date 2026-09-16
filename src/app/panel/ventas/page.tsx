import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { COL_MD } from "@/utilidades/tabla-panel";

export const dynamic = "force-dynamic";

export default async function PaginaPanelVentas() {
  await requerirPermiso(CODIGOS_PERMISO.VENTAS_VER, "/panel/ventas");

  const ventas = await prisma.venta.findMany({
    orderBy: { creadoEn: "desc" },
    take: 100,
    include: {
      cliente: { select: { nombre: true } },
      _count: { select: { detalles: true } },
    },
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Ventas"
      descripcion="Historial de ventas y acceso al punto de venta."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5C6675]">
          <Link
            href="/panel/caja"
            className="font-semibold text-[#D96A00] hover:underline"
          >
            Caja
          </Link>
          {" · "}
          {ventas.length} recientes
        </p>
        <Link
          href="/panel/ventas/nueva"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          + Nueva venta (POS)
        </Link>
      </div>

      {ventas.length === 0 ? (
        <p className="border border-dashed border-[#E4E7EC] bg-white px-4 py-8 text-center text-sm text-[#5C6675]">
          Todavía no hay ventas.
        </p>
      ) : (
        <div className="border border-[#E4E7EC] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
              <tr>
                <th className="px-2 py-2 font-semibold sm:px-3">Número</th>
                <th className="px-2 py-2 font-semibold sm:px-3">Cliente</th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Ítems
                </th>
                <th className="px-2 py-2 font-semibold sm:px-3">Total</th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Estado
                </th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Fecha
                </th>
                <th className="px-2 py-2 font-semibold sm:px-3"> </th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-2 py-2 font-mono text-xs text-[#1D2430] sm:px-3">
                    {v.numero}
                  </td>
                  <td className="px-2 py-2 text-[#1D2430] sm:px-3">
                    <div>{v.cliente?.nombre ?? "Consumidor final"}</div>
                    <div className="mt-0.5 text-[11px] text-[#5C6675] md:hidden">
                      {v.fecha.toLocaleDateString("es-VE")} ·{" "}
                      {v.estadoDocumento}
                    </div>
                  </td>
                  <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {v._count.detalles}
                  </td>
                  <td className="px-2 py-2 text-[#1D2430] sm:px-3">
                    {Number(v.total).toFixed(2)}
                  </td>
                  <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {v.estadoDocumento}
                  </td>
                  <td
                    className={`${COL_MD} px-2 py-2 text-xs text-[#8A94A2] sm:px-3`}
                  >
                    {v.fecha.toLocaleString("es-VE")}
                  </td>
                  <td className="px-2 py-2 text-right sm:px-3">
                    <Link
                      href={`/panel/ventas/${v.id}`}
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
