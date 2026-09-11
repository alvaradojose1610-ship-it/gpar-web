import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";
import { accionActualizarEstadoCotizacion } from "@/modulos/cotizaciones/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaginaDetalleCotizacion({ params }: Props) {
  await requerirSesion();
  const { id } = await params;

  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id },
    include: { detalles: true },
  });

  if (!cotizacion) notFound();

  return (
    <PaginaPlaceholderPanel
      titulo={cotizacion.numero}
      descripcion={`Origen ${cotizacion.origen} · estado ${cotizacion.estado}`}
    >
      <p className="mb-4">
        <Link
          href="/panel/cotizaciones"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Volver a cotizaciones
        </Link>
      </p>

      <form
        action={accionActualizarEstadoCotizacion}
        className="mb-6 flex flex-wrap items-end gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <input type="hidden" name="id" value={cotizacion.id} />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Cambiar estado</span>
          <select
            name="estado"
            defaultValue={cotizacion.estado}
            className="min-h-10 border border-[#E4E7EC] bg-[#F7F8FA] px-3"
          >
            <option value="RECIBIDA">Recibida</option>
            <option value="EN_REVISION">En revisión</option>
            <option value="ENVIADA">Enviada</option>
            <option value="ACEPTADA">Aceptada</option>
            <option value="RECHAZADA">Rechazada</option>
            <option value="ANULADA">Anulada</option>
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
        >
          Guardar
        </button>
      </form>

      <div className="mb-6 grid gap-4 border border-[#E4E7EC] bg-white p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#8A94A2]">
            Contacto
          </p>
          <p className="mt-1 font-semibold text-[#1D2430]">
            {cotizacion.nombreContacto}
          </p>
          <p className="text-sm text-[#5C6675]">
            {cotizacion.telefono || "—"}
            {cotizacion.correo ? ` · ${cotizacion.correo}` : ""}
          </p>
          {cotizacion.empresa ? (
            <p className="text-sm text-[#5C6675]">{cotizacion.empresa}</p>
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[#8A94A2]">
            Mensaje
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-[#1D2430]">
            {cotizacion.mensaje || "—"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
            <tr>
              <th className="px-3 py-2 font-semibold">Código</th>
              <th className="px-3 py-2 font-semibold">Producto</th>
              <th className="px-3 py-2 font-semibold">Cant.</th>
            </tr>
          </thead>
          <tbody>
            {cotizacion.detalles.map((d) => (
              <tr
                key={d.id}
                className="border-b border-[#EEF0F3] last:border-0"
              >
                <td className="px-3 py-2 font-mono text-xs">{d.codigo}</td>
                <td className="px-3 py-2">{d.nombre}</td>
                <td className="px-3 py-2">{d.cantidad.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PaginaPlaceholderPanel>
  );
}
