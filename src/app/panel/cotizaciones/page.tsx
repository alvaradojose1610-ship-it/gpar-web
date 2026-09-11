import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

const etiquetasEstado: Record<string, string> = {
  RECIBIDA: "Recibida",
  EN_REVISION: "En revisión",
  ENVIADA: "Enviada",
  ACEPTADA: "Aceptada",
  RECHAZADA: "Rechazada",
  VENCIDA: "Vencida",
  CONVERTIDA: "Convertida",
  ANULADA: "Anulada",
  BORRADOR: "Borrador",
};

export default async function PaginaPanelCotizaciones() {
  await requerirSesion();

  const cotizaciones = await prisma.cotizacion.findMany({
    orderBy: { creadoEn: "desc" },
    take: 100,
    include: {
      _count: { select: { detalles: true } },
    },
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Cotizaciones"
      descripcion="Solicitudes recibidas desde la web y el panel."
    >
      {cotizaciones.length === 0 ? (
        <p className="border border-dashed border-[#E4E7EC] bg-white px-4 py-8 text-center text-sm text-[#5C6675]">
          Todavía no hay cotizaciones. Las del formulario web aparecerán aquí.
        </p>
      ) : (
        <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
              <tr>
                <th className="px-3 py-2 font-semibold">Número</th>
                <th className="px-3 py-2 font-semibold">Contacto</th>
                <th className="px-3 py-2 font-semibold">Estado</th>
                <th className="px-3 py-2 font-semibold">Ítems</th>
                <th className="px-3 py-2 font-semibold">Fecha</th>
                <th className="px-3 py-2 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-3 py-2 font-mono text-xs text-[#1D2430]">
                    {c.numero}
                  </td>
                  <td className="px-3 py-2 text-[#1D2430]">
                    <div className="font-medium">{c.nombreContacto}</div>
                    <div className="text-xs text-[#5C6675]">
                      {c.telefono || c.correo || "—"}
                      {c.empresa ? ` · ${c.empresa}` : ""}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {etiquetasEstado[c.estado] ?? c.estado}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {c._count.detalles}
                  </td>
                  <td className="px-3 py-2 text-xs text-[#8A94A2]">
                    {c.creadoEn.toLocaleString("es-VE")}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/panel/cotizaciones/${c.id}`}
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
