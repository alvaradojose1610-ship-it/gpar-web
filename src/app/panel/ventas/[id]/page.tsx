import Link from "next/link";
import { notFound } from "next/navigation";

import { BotonConfirmar } from "@/componentes/panel/BotonConfirmar";
import { BotonImprimir } from "@/componentes/panel/BotonImprimir";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import {
  requerirPermiso,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";
import { accionAnularVenta } from "@/modulos/ventas/acciones";
import { accionCrearCuentaPorCobrarDesdeVenta } from "@/modulos/cuentas/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
};

export default async function PaginaDetalleVenta({
  params,
  searchParams,
}: Props) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.VENTAS_VER,
    "/panel/ventas",
  );
  const { id } = await params;
  const q = await searchParams;

  const venta = await prisma.venta.findUnique({
    where: { id },
    include: {
      cliente: true,
      cuentaPorCobrar: true,
      detalles: {
        include: { producto: { select: { codigo: true, nombre: true } } },
      },
    },
  });
  if (!venta) notFound();

  const puedeAnular =
    venta.estadoDocumento === "CONFIRMADA" &&
    tienePermiso(sesion, CODIGOS_PERMISO.VENTAS_CREAR);
  const puedeCxC =
    venta.estadoDocumento === "CONFIRMADA" &&
    !venta.cuentaPorCobrar &&
    tienePermiso(sesion, CODIGOS_PERMISO.CUENTAS_EDITAR);

  return (
    <PaginaPlaceholderPanel
      titulo={venta.numero}
      descripcion={`Estado ${venta.estadoDocumento} · ${venta.fecha.toLocaleString("es-VE")}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/panel/ventas"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Ventas
        </Link>
        <BotonImprimir etiqueta="Imprimir ticket" />
      </div>

      {q.ok === "anulada" ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 print:hidden">
          Venta anulada. Stock restituido y, si aplicaba, movimiento de caja
          revertido.
        </p>
      ) : null}
      {q.error === "cxc" ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 print:hidden">
          No se pudo crear la cuenta por cobrar (revisa el estado de la venta).
        </p>
      ) : null}

      <div className="mb-4 border border-[#E4E7EC] bg-white p-4 text-sm">
        <p>
          <span className="text-[#5C6675]">Cliente: </span>
          {venta.cliente?.nombre ?? "Consumidor final"}
        </p>
        <p>
          <span className="text-[#5C6675]">Total: </span>
          {Number(venta.total).toFixed(2)} USD
        </p>
        <p>
          <span className="text-[#5C6675]">Condición: </span>
          {venta.condicionPago}
        </p>
        {venta.observaciones ? (
          <p className="mt-2">
            <span className="text-[#5C6675]">Observaciones: </span>
            {venta.observaciones}
          </p>
        ) : null}
      </div>

      <div className="mb-6 overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-3 py-2">Código</th>
              <th className="px-3 py-2">Producto</th>
              <th className="px-3 py-2">Cant.</th>
              <th className="px-3 py-2">Precio</th>
              <th className="px-3 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.detalles.map((d) => (
              <tr key={d.id} className="border-b border-[#EEF0F3]">
                <td className="px-3 py-2 font-mono text-xs">
                  {d.producto.codigo}
                </td>
                <td className="px-3 py-2">{d.producto.nombre}</td>
                <td className="px-3 py-2">{Number(d.cantidad)}</td>
                <td className="px-3 py-2">
                  {Number(d.precioUnitario).toFixed(2)}
                </td>
                <td className="px-3 py-2">{Number(d.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="print:hidden">
        {puedeCxC ? (
          <form action={accionCrearCuentaPorCobrarDesdeVenta} className="mb-4">
            <input type="hidden" name="ventaId" value={venta.id} />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center border border-[#F57C00] px-4 text-sm font-semibold text-[#D96A00]"
            >
              Pasar a crédito (crear CxC)
            </button>
          </form>
        ) : null}

        {venta.cuentaPorCobrar ? (
          <p className="mb-4 text-sm">
            <Link
              href={`/panel/cuentas-por-cobrar/${venta.cuentaPorCobrar.id}`}
              className="font-semibold text-[#D96A00] underline"
            >
              Ver cuenta por cobrar
            </Link>
          </p>
        ) : null}

        {puedeAnular ? (
          <form action={accionAnularVenta}>
            <input type="hidden" name="id" value={venta.id} />
            <BotonConfirmar
              mensaje={`¿Anular la venta ${venta.numero}? Se restituirá el stock.`}
              className="inline-flex min-h-10 items-center border border-red-300 bg-white px-4 text-sm font-semibold text-red-800 hover:bg-red-50"
            >
              Anular venta (restituye stock)
            </BotonConfirmar>
          </form>
        ) : null}
      </div>
    </PaginaPlaceholderPanel>
  );
}
