import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { vencerApartadosCaducados } from "@/modulos/apartados/acciones";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaPanelApartados() {
  await requerirPermiso(CODIGOS_PERMISO.APARTADOS_VER, "/panel/apartados");
  await vencerApartadosCaducados();

  const apartados = await prisma.apartado.findMany({
    orderBy: { creadoEn: "desc" },
    take: 100,
    include: {
      _count: { select: { detalles: true } },
      cliente: { select: { nombre: true } },
    },
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Apartados"
      descripcion="Reservas temporales de stock. La cotización web no reserva; el apartado sí."
    >
      <div className="mb-4 flex justify-end">
        <Link
          href="/panel/apartados/nuevo"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
        >
          + Nuevo apartado
        </Link>
      </div>

      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-3 py-2">Número</th>
              <th className="px-3 py-2">Contacto</th>
              <th className="px-3 py-2">Ítems</th>
              <th className="px-3 py-2">Vence</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {apartados.map((a) => (
              <tr key={a.id} className="border-b border-[#EEF0F3]">
                <td className="px-3 py-2 font-mono text-xs">{a.numero}</td>
                <td className="px-3 py-2">
                  {a.cliente?.nombre ?? a.nombreContacto}
                </td>
                <td className="px-3 py-2">{a._count.detalles}</td>
                <td className="px-3 py-2 text-xs text-[#5C6675]">
                  {a.vencimientoEn.toLocaleString("es-VE")}
                </td>
                <td className="px-3 py-2">{a.estado}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/panel/apartados/${a.id}`}
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
    </PaginaPlaceholderPanel>
  );
}
