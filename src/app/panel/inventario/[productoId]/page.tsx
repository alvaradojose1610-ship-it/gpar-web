import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";
import {
  esEntradaInventario,
  obtenerStockProducto,
} from "@/modulos/inventario/stock";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ productoId: string }>;
};

export default async function PaginaDetalleInventario({ params }: Props) {
  await requerirSesion();
  const { productoId } = await params;

  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
    select: {
      id: true,
      codigo: true,
      nombre: true,
      precioCosto: true,
      precioVenta: true,
    },
  });
  if (!producto) notFound();

  const [stock, movimientos, historialCompras] = await Promise.all([
    obtenerStockProducto(productoId),
    prisma.movimientoInventario.findMany({
      where: { productoId },
      orderBy: { creadoEn: "desc" },
      take: 100,
      include: {
        almacen: { select: { codigo: true, nombre: true } },
        usuario: { select: { nombre: true } },
      },
    }),
    prisma.detalleCompra.findMany({
      where: { productoId },
      orderBy: { compra: { fecha: "desc" } },
      take: 50,
      include: {
        compra: {
          select: {
            numero: true,
            fecha: true,
            proveedor: { select: { razonSocial: true } },
          },
        },
      },
    }),
  ]);

  return (
    <PaginaPlaceholderPanel
      titulo={`${producto.codigo} · ${producto.nombre}`}
      descripcion={`Stock actual: ${stock} · Costo: ${Number(producto.precioCosto).toFixed(2)} · Venta: ${Number(producto.precioVenta).toFixed(2)}`}
    >
      <p className="mb-6">
        <Link
          href="/panel/inventario"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Inventario
        </Link>
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#5C6675]">
          Movimientos
        </h2>
        {movimientos.length === 0 ? (
          <p className="border border-dashed border-[#E4E7EC] bg-white px-4 py-6 text-sm text-[#5C6675]">
            Sin movimientos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Fecha</th>
                  <th className="px-3 py-2 font-semibold">Tipo</th>
                  <th className="px-3 py-2 font-semibold">Cant.</th>
                  <th className="px-3 py-2 font-semibold">Almacén</th>
                  <th className="px-3 py-2 font-semibold">Ref.</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[#EEF0F3] last:border-0"
                  >
                    <td className="px-3 py-2 text-xs text-[#8A94A2]">
                      {m.creadoEn.toLocaleString("es-VE")}
                    </td>
                    <td className="px-3 py-2 text-[#1D2430]">{m.tipo}</td>
                    <td className="px-3 py-2 font-medium text-[#1D2430]">
                      {esEntradaInventario(m.tipo) ? "+" : "−"}
                      {Number(m.cantidad)}
                    </td>
                    <td className="px-3 py-2 text-[#5C6675]">
                      {m.almacen.codigo}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-[#5C6675]">
                      {m.referencia || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#5C6675]">
          Historial de compras (proveedor + costo)
        </h2>
        {historialCompras.length === 0 ? (
          <p className="border border-dashed border-[#E4E7EC] bg-white px-4 py-6 text-sm text-[#5C6675]">
            Sin compras previas de este producto.
            {stock <= 0
              ? " Con stock 0 puedes usar este historial para reordenar."
              : null}
          </p>
        ) : (
          <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Compra</th>
                  <th className="px-3 py-2 font-semibold">Proveedor</th>
                  <th className="px-3 py-2 font-semibold">Cant.</th>
                  <th className="px-3 py-2 font-semibold">Costo unit.</th>
                  <th className="px-3 py-2 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historialCompras.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-[#EEF0F3] last:border-0"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-[#1D2430]">
                      {d.compra.numero}
                    </td>
                    <td className="px-3 py-2 text-[#1D2430]">
                      {d.compra.proveedor.razonSocial}
                    </td>
                    <td className="px-3 py-2 text-[#5C6675]">
                      {Number(d.cantidad)}
                    </td>
                    <td className="px-3 py-2 text-[#1D2430]">
                      {Number(d.costoUnitario).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-xs text-[#8A94A2]">
                      {d.compra.fecha.toLocaleString("es-VE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PaginaPlaceholderPanel>
  );
}
