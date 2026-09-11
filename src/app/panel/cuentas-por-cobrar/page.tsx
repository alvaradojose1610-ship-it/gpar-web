import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

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
      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-3 py-2">Venta</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Saldo</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="px-3 py-2 font-mono text-xs">{c.venta.numero}</td>
                <td className="px-3 py-2">
                  {c.cliente?.nombre ?? "—"}
                </td>
                <td className="px-3 py-2">{Number(c.total).toFixed(2)}</td>
                <td className="px-3 py-2">{Number(c.saldo).toFixed(2)}</td>
                <td className="px-3 py-2">{c.estado}</td>
                <td className="px-3 py-2 text-right">
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
