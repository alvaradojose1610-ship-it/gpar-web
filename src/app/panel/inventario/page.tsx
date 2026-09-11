import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";
import { obtenerMapaStock } from "@/modulos/inventario/stock";

export const dynamic = "force-dynamic";

export default async function PaginaPanelInventario() {
  await requerirSesion();

  const productos = await prisma.producto.findMany({
    where: { estado: "ACTIVO" },
    orderBy: [{ linea: "asc" }, { codigo: "asc" }],
    take: 300,
    select: {
      id: true,
      codigo: true,
      nombre: true,
      linea: true,
      precioCosto: true,
      precioVenta: true,
      stockMinimo: true,
    },
  });

  const stockMap = await obtenerMapaStock(productos.map((p) => p.id));

  return (
    <PaginaPlaceholderPanel
      titulo="Inventario"
      descripcion="Stock calculado por movimientos de inventario."
    >
      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
            <tr>
              <th className="px-3 py-2 font-semibold">Código</th>
              <th className="px-3 py-2 font-semibold">Producto</th>
              <th className="px-3 py-2 font-semibold">Stock</th>
              <th className="px-3 py-2 font-semibold">Costo</th>
              <th className="px-3 py-2 font-semibold">Venta</th>
              <th className="px-3 py-2 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const stock = stockMap.get(p.id) ?? 0;
              const sinStock = stock <= 0;
              return (
                <tr
                  key={p.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-3 py-2 font-mono text-xs text-[#1D2430]">
                    {p.codigo}
                  </td>
                  <td className="px-3 py-2 text-[#1D2430]">{p.nombre}</td>
                  <td
                    className={`px-3 py-2 font-medium ${sinStock ? "text-red-700" : "text-[#1D2430]"}`}
                  >
                    {stock}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {Number(p.precioCosto).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {Number(p.precioVenta).toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/panel/inventario/${p.id}`}
                      className="text-sm font-semibold text-[#D96A00] hover:underline"
                    >
                      {sinStock ? "Historial / detalle" : "Detalle"}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PaginaPlaceholderPanel>
  );
}
