import Link from "next/link";

import { EnlaceWhatsAppCotizacion } from "@/componentes/panel/EnlaceWhatsAppCotizacion";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { COL_MD } from "@/utilidades/tabla-panel";
import { lineasWhatsAppDesdeDetalles } from "@/utilidades/whatsapp";

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
  await requerirPermiso(CODIGOS_PERMISO.COTIZACIONES_VER, "/panel/cotizaciones");

  const cotizaciones = await prisma.cotizacion.findMany({
    orderBy: { creadoEn: "desc" },
    take: 100,
    include: {
      detalles: {
        select: {
          codigo: true,
          nombre: true,
          cantidad: true,
          precioUnitario: true,
        },
      },
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
        <div className="border border-[#E4E7EC] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
              <tr>
                <th className="px-2 py-2 font-semibold sm:px-3">Número</th>
                <th className="px-2 py-2 font-semibold sm:px-3">Contacto</th>
                <th className="px-2 py-2 font-semibold sm:px-3">Estado</th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Ítems
                </th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Fecha
                </th>
                <th className="px-2 py-2 font-semibold sm:px-3"> </th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-2 py-2 font-mono text-xs text-[#1D2430] sm:px-3">
                    {c.numero}
                  </td>
                  <td className="px-2 py-2 text-[#1D2430] sm:px-3">
                    <div className="font-medium">{c.nombreContacto}</div>
                    <div className="text-xs text-[#5C6675]">
                      {c.telefono || c.correo || "—"}
                      {c.empresa ? ` · ${c.empresa}` : ""}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-[#5C6675] sm:px-3">
                    {etiquetasEstado[c.estado] ?? c.estado}
                  </td>
                  <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {c.detalles.length}
                  </td>
                  <td
                    className={`${COL_MD} px-2 py-2 text-xs text-[#8A94A2] sm:px-3`}
                  >
                    {c.creadoEn.toLocaleString("es-VE")}
                  </td>
                  <td className="px-2 py-2 sm:px-3">
                    <div className="flex flex-col items-start gap-1">
                      <Link
                        href={`/panel/cotizaciones/${c.id}`}
                        className="text-sm font-semibold text-[#D96A00] hover:underline"
                      >
                        Ver
                      </Link>
                      <EnlaceWhatsAppCotizacion
                        variante="enlace"
                        telefono={c.telefono}
                        nombreContacto={c.nombreContacto}
                        numero={c.numero}
                        mensaje={c.mensaje}
                        detalles={lineasWhatsAppDesdeDetalles(c.detalles)}
                      />
                    </div>
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
