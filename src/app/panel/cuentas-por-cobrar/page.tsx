import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { COL_MD } from "@/utilidades/tabla-panel";

export const dynamic = "force-dynamic";

export default async function PaginaCuentasPorCobrar() {
  await requerirPermiso(CODIGOS_PERMISO.CUENTAS_VER, "/panel/cuentas-por-cobrar");

  const cuentas = await prisma.cuentaPorCobrar.findMany({
    orderBy: { creadoEn: "desc" },
    take: 100,
    include: {
      cliente: { select: { nombre: true } },
      venta: { select: { numero: true } },
    },
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Cuentas por cobrar"
      descripcion="Créditos de clientes ligados a ventas."
    >
      <div className="border border-[#E4E7EC] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-2 py-2 sm:px-3">Venta</th>
              <th className="px-2 py-2 sm:px-3">Cliente</th>
              <th className={`${COL_MD} px-2 py-2 sm:px-3`}>Total</th>
              <th className="px-2 py-2 sm:px-3">Saldo</th>
              <th className={`${COL_MD} px-2 py-2 sm:px-3`}>Estado</th>
              <th className="px-2 py-2 sm:px-3"> </th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="px-2 py-2 font-mono text-xs sm:px-3">
                  {c.venta.numero}
                </td>
                <td className="px-2 py-2 sm:px-3">
                  <div>{c.cliente?.nombre ?? "—"}</div>
                  <div className="mt-0.5 text-[11px] text-[#5C6675] md:hidden">
                    {c.estado}
                  </div>
                </td>
                <td className={`${COL_MD} px-2 py-2 sm:px-3`}>
                  {Number(c.total).toFixed(2)}
                </td>
                <td className="px-2 py-2 sm:px-3">
                  {Number(c.saldo).toFixed(2)}
                </td>
                <td className={`${COL_MD} px-2 py-2 sm:px-3`}>{c.estado}</td>
                <td className="px-2 py-2 text-right sm:px-3">
                  <Link
                    href={`/panel/cuentas-por-cobrar/${c.id}`}
                    className="font-semibold text-[#D96A00] hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cuentas.length === 0 ? (
        <p className="mt-4 text-sm text-[#5C6675]">
          Aún no hay CxC. Desde el detalle de una venta confirmada puedes
          pasarla a crédito.
        </p>
      ) : null}
    </PaginaPlaceholderPanel>
  );
}
