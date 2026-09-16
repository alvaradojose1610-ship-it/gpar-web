import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { vencerApartadosCaducados } from "@/modulos/apartados/acciones";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { COL_MD } from "@/utilidades/tabla-panel";

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

      <div className="border border-[#E4E7EC] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-2 py-2 sm:px-3">Número</th>
              <th className="px-2 py-2 sm:px-3">Contacto</th>
              <th className={`${COL_MD} px-2 py-2 sm:px-3`}>Ítems</th>
              <th className={`${COL_MD} px-2 py-2 sm:px-3`}>Vence</th>
              <th className="px-2 py-2 sm:px-3">Estado</th>
              <th className="px-2 py-2 sm:px-3"> </th>
            </tr>
          </thead>
          <tbody>
            {apartados.map((a) => (
              <tr key={a.id} className="border-b border-[#EEF0F3]">
                <td className="px-2 py-2 font-mono text-xs sm:px-3">
                  {a.numero}
                </td>
                <td className="px-2 py-2 sm:px-3">
                  <div>{a.cliente?.nombre ?? a.nombreContacto}</div>
                  <div className="mt-0.5 text-[11px] text-[#5C6675] md:hidden">
                    Vence {a.vencimientoEn.toLocaleDateString("es-VE")}
                  </div>
                </td>
                <td className={`${COL_MD} px-2 py-2 sm:px-3`}>
                  {a._count.detalles}
                </td>
                <td className={`${COL_MD} px-2 py-2 text-xs text-[#5C6675] sm:px-3`}>
                  {a.vencimientoEn.toLocaleString("es-VE")}
                </td>
                <td className="px-2 py-2 sm:px-3">{a.estado}</td>
                <td className="px-2 py-2 text-right sm:px-3">
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
