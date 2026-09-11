import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaCuentasPorPagar() {
  await requerirPermiso(CODIGOS_PERMISO.CUENTAS_VER, "/panel/cuentas-por-pagar");

  const cuentas = await prisma.cuentaPorPagar.findMany({
    orderBy: { creadoEn: "desc" },
    take: 100,
    include: {
      proveedor: { select: { razonSocial: true } },
      compra: { select: { numero: true } },
    },
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Cuentas por pagar"
      descripcion="Créditos con proveedores ligados a compras."
    >
      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-3 py-2">Compra</th>
              <th className="px-3 py-2">Proveedor</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Saldo</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="px-3 py-2 font-mono text-xs">{c.compra.numero}</td>
                <td className="px-3 py-2">{c.proveedor.razonSocial}</td>
                <td className="px-3 py-2">{Number(c.total).toFixed(2)}</td>
                <td className="px-3 py-2">{Number(c.saldo).toFixed(2)}</td>
                <td className="px-3 py-2">{c.estado}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/panel/cuentas-por-pagar/${c.id}`}
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
          Aún no hay CxP. Desde el detalle de una compra puedes pasarla a
          crédito.
        </p>
      ) : null}
    </PaginaPlaceholderPanel>
  );
}
