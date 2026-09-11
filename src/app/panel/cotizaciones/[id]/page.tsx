import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import {
  requerirPermiso,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";
import {
  accionActualizarEstadoCotizacion,
  accionConvertirCotizacionAVenta,
} from "@/modulos/cotizaciones/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaDetalleCotizacion({
  params,
  searchParams,
}: Props) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.COTIZACIONES_VER,
    "/panel/cotizaciones",
  );
  const { id } = await params;
  const q = await searchParams;

  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id },
    include: { detalles: true, venta: { select: { id: true, numero: true } } },
  });

  if (!cotizacion) notFound();

  const puedeEditar = tienePermiso(sesion, CODIGOS_PERMISO.COTIZACIONES_EDITAR);
  const puedeVender = tienePermiso(sesion, CODIGOS_PERMISO.VENTAS_CREAR);
  const convertible =
    puedeEditar &&
    puedeVender &&
    !cotizacion.ventaId &&
    cotizacion.estado !== "CONVERTIDA" &&
    cotizacion.estado !== "ANULADA" &&
    cotizacion.estado !== "RECHAZADA";

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

      {q.error === "ya-convertida" ? (
        <p className="mb-4 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Esta cotización ya fue convertida a venta.
        </p>
      ) : null}
      {q.error === "estado" ? (
        <p className="mb-4 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          No se puede convertir una cotización anulada o rechazada.
        </p>
      ) : null}

      {cotizacion.venta ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Convertida a venta{" "}
          <Link
            href={`/panel/ventas/${cotizacion.venta.id}`}
            className="font-semibold underline"
          >
            {cotizacion.venta.numero}
          </Link>
        </p>
      ) : null}

      {puedeEditar && cotizacion.estado !== "CONVERTIDA" ? (
        <form
          action={accionActualizarEstadoCotizacion}
          className="mb-4 flex flex-wrap items-end gap-3 border border-[#E4E7EC] bg-white p-4"
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
      ) : null}

      {convertible ? (
        <form action={accionConvertirCotizacionAVenta} className="mb-6">
          <input type="hidden" name="id" value={cotizacion.id} />
          <button
            type="submit"
            className="inline-flex min-h-10 items-center border border-[#F57C00] bg-white px-4 text-sm font-bold text-[#D96A00] hover:bg-[#FFF3E6]"
          >
            Convertir a venta (abre POS)
          </button>
        </form>
      ) : null}

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
