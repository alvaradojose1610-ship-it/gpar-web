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
import { accionAnularCompra } from "@/modulos/compras/acciones";
import { accionCrearCuentaPorPagarDesdeCompra } from "@/modulos/cuentas/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
};

export default async function PaginaDetalleCompra({
  params,
  searchParams,
}: Props) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.COMPRAS_VER,
    "/panel/compras",
  );
  const { id } = await params;
  const q = await searchParams;

  const compra = await prisma.compra.findUnique({
    where: { id },
    include: {
      proveedor: true,
      cuentaPorPagar: true,
      detalles: {
        include: { producto: { select: { codigo: true, nombre: true } } },
      },
    },
  });
  if (!compra) notFound();

  const puedeAnular =
    compra.estadoDocumento === "CONFIRMADA" &&
    tienePermiso(sesion, CODIGOS_PERMISO.COMPRAS_EDITAR);
  const puedeCxP =
    compra.estadoDocumento === "CONFIRMADA" &&
    !compra.cuentaPorPagar &&
    tienePermiso(sesion, CODIGOS_PERMISO.CUENTAS_EDITAR);

  return (
    <PaginaPlaceholderPanel
      titulo={compra.numero}
      descripcion={`Estado ${compra.estadoDocumento} · ${compra.fecha.toLocaleString("es-VE")}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/panel/compras"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Compras
        </Link>
        <BotonImprimir etiqueta="Imprimir" />
      </div>

      {q.ok === "anulada" ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 print:hidden">
          Compra anulada. El stock de entrada fue revertido.
        </p>
      ) : null}
      {q.error === "cxp" ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 print:hidden">
          No se pudo crear la cuenta por pagar (revisa el estado de la compra).
        </p>
      ) : null}

      <div className="mb-4 border border-[#E4E7EC] bg-white p-4 text-sm">
        <p>
          <span className="text-[#5C6675]">Proveedor: </span>
          {compra.proveedor.razonSocial}
        </p>
        <p>
          <span className="text-[#5C6675]">Total: </span>
          {Number(compra.total).toFixed(2)} USD
        </p>
        <p>
          <span className="text-[#5C6675]">Condición: </span>
          {compra.condicionPago}
        </p>
        {compra.observaciones ? (
          <p className="mt-2">
            <span className="text-[#5C6675]">Observaciones: </span>
            {compra.observaciones}
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
              <th className="px-3 py-2">Costo</th>
              <th className="px-3 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {compra.detalles.map((d) => (
              <tr key={d.id} className="border-b border-[#EEF0F3]">
                <td className="px-3 py-2 font-mono text-xs">
                  {d.producto.codigo}
                </td>
                <td className="px-3 py-2">{d.producto.nombre}</td>
                <td className="px-3 py-2">{Number(d.cantidad)}</td>
                <td className="px-3 py-2">
                  {Number(d.costoUnitario).toFixed(2)}
                </td>
                <td className="px-3 py-2">{Number(d.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="print:hidden">
        {puedeCxP ? (
          <form action={accionCrearCuentaPorPagarDesdeCompra} className="mb-4">
            <input type="hidden" name="compraId" value={compra.id} />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center border border-[#F57C00] px-4 text-sm font-semibold text-[#D96A00]"
            >
              Pasar a crédito (crear CxP)
            </button>
          </form>
        ) : null}

        {compra.cuentaPorPagar ? (
          <p className="mb-4 text-sm">
            <Link
              href={`/panel/cuentas-por-pagar/${compra.cuentaPorPagar.id}`}
              className="font-semibold text-[#D96A00] underline"
            >
              Ver cuenta por pagar
            </Link>
          </p>
        ) : null}

        {puedeAnular ? (
          <form action={accionAnularCompra}>
            <input type="hidden" name="id" value={compra.id} />
            <BotonConfirmar
              mensaje={`¿Anular la compra ${compra.numero}? Se revertirá el stock de entrada.`}
              className="inline-flex min-h-10 items-center border border-red-300 bg-white px-4 text-sm font-semibold text-red-800 hover:bg-red-50"
            >
              Anular compra (revierte stock)
            </BotonConfirmar>
          </form>
        ) : null}
      </div>
    </PaginaPlaceholderPanel>
  );
}
