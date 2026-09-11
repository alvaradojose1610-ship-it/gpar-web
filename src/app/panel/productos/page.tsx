import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaPanelProductos() {
  await requerirSesion();

  const productos = await prisma.producto.findMany({
    where: { estado: "ACTIVO" },
    include: { categoria: true, marca: true },
    orderBy: [{ linea: "asc" }, { codigo: "asc" }],
    take: 200,
  });

  const total = await prisma.producto.count({ where: { estado: "ACTIVO" } });

  return (
    <PaginaPlaceholderPanel
      titulo="Productos"
      descripcion="Catálogo interno conectado a la base de datos."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5C6675]">
          {total} referencias activas · QR en{" "}
          <span className="font-mono text-xs">/p/[token]</span>
        </p>
        <Link
          href="/panel/productos/nuevo"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
            <tr>
              <th className="px-3 py-2 font-semibold">Código</th>
              <th className="px-3 py-2 font-semibold">Nombre</th>
              <th className="px-3 py-2 font-semibold">Línea</th>
              <th className="px-3 py-2 font-semibold">Categoría</th>
              <th className="px-3 py-2 font-semibold">Web</th>
              <th className="px-3 py-2 font-semibold">QR</th>
              <th className="px-3 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr
                key={producto.id}
                className="border-b border-[#EEF0F3] last:border-0"
              >
                <td className="px-3 py-2 font-mono text-xs text-[#1D2430]">
                  {producto.codigo}
                </td>
                <td className="px-3 py-2 text-[#1D2430]">{producto.nombre}</td>
                <td className="px-3 py-2 capitalize text-[#5C6675]">
                  {producto.linea.toLowerCase()}
                </td>
                <td className="px-3 py-2 text-[#5C6675]">
                  {producto.categoria.nombre}
                </td>
                <td className="px-3 py-2 text-[#5C6675]">
                  {producto.visibleWeb ? "Sí" : "No"}
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/p/${producto.tokenPublico}`}
                    className="font-mono text-xs text-[#D96A00] hover:underline"
                    target="_blank"
                  >
                    Abrir
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/panel/productos/${producto.id}/editar`}
                    className="mr-3 text-xs font-semibold text-[#D96A00] hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/panel/productos/${producto.id}/etiqueta`}
                    className="text-xs font-semibold text-[#1D2430] hover:underline"
                  >
                    Imprimir
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
