import Link from "next/link";

import { TablaProductosFiltrable } from "@/componentes/panel/TablaProductosFiltrable";
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
    take: 500,
  });

  const total = await prisma.producto.count({ where: { estado: "ACTIVO" } });

  const filas = productos.map((producto) => ({
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    linea: producto.linea,
    categoriaNombre: producto.categoria.nombre,
    visibleWeb: producto.visibleWeb,
    tokenPublico: producto.tokenPublico,
    imagenUrl: producto.imagenUrl,
  }));

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

      <TablaProductosFiltrable productos={filas} />
    </PaginaPlaceholderPanel>
  );
}
