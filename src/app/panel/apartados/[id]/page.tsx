import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import {
  accionCancelarApartado,
  accionConvertirApartadoAVenta,
  vencerApartadosCaducados,
} from "@/modulos/apartados/acciones";
import {
  requerirPermiso,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
};

export default async function PaginaDetalleApartado({
  params,
  searchParams,
}: Props) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.APARTADOS_VER,
    "/panel/apartados",
  );
  await vencerApartadosCaducados();
  const { id } = await params;
  const q = await searchParams;

  const apartado = await prisma.apartado.findUnique({
    where: { id },
    include: {
      detalles: {
        include: { producto: { select: { codigo: true, nombre: true } } },
      },
      venta: { select: { id: true, numero: true } },
    },
  });
  if (!apartado) notFound();

  const puedeEditar = tienePermiso(sesion, CODIGOS_PERMISO.APARTADOS_EDITAR);
  const activo = apartado.estado === "ACTIVO";

  return (
    <PaginaPlaceholderPanel
      titulo={apartado.numero}
      descripcion={`Estado ${apartado.estado} · vence ${apartado.vencimientoEn.toLocaleString("es-VE")}`}
    >
      <p className="mb-4">
        <Link
          href="/panel/apartados"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Apartados
        </Link>
      </p>

      {q.ok === "cancelado" ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Apartado cancelado. El stock vuelve a estar disponible.
        </p>
      ) : null}

      <div className="mb-4 border border-[#E4E7EC] bg-white p-4 text-sm">
        <p>
          <span className="text-[#5C6675]">Contacto: </span>
          {apartado.nombreContacto}
          {apartado.telefono ? ` · ${apartado.telefono}` : ""}
        </p>
        {apartado.venta ? (
          <p>
            Convertido a{" "}
            <Link
              href={`/panel/ventas/${apartado.venta.id}`}
              className="font-semibold text-[#D96A00] underline"
            >
              {apartado.venta.numero}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mb-6 overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-3 py-2">Código</th>
              <th className="px-3 py-2">Producto</th>
              <th className="px-3 py-2">Cant.</th>
            </tr>
          </thead>
          <tbody>
            {apartado.detalles.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="px-3 py-2 font-mono text-xs">
                  {d.producto.codigo}
                </td>
                <td className="px-3 py-2">{d.producto.nombre}</td>
                <td className="px-3 py-2">{Number(d.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {puedeEditar && activo ? (
        <div className="flex flex-wrap gap-3">
          <form action={accionConvertirApartadoAVenta}>
            <input type="hidden" name="id" value={apartado.id} />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
            >
              Convertir a venta
            </button>
          </form>
          <form action={accionCancelarApartado}>
            <input type="hidden" name="id" value={apartado.id} />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center border border-red-300 px-4 text-sm font-semibold text-red-800"
            >
              Cancelar apartado
            </button>
          </form>
        </div>
      ) : null}
    </PaginaPlaceholderPanel>
  );
}
