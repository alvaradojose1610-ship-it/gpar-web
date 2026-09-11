import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ ok?: string; error?: string }>;
};

export default async function PaginaPanelCategorias({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.CATEGORIAS_VER, "/panel/categorias");
  const params = await searchParams;

  const categorias = await prisma.categoria.findMany({
    orderBy: [{ linea: "asc" }, { orden: "asc" }, { nombre: "asc" }],
    include: { _count: { select: { productos: true } } },
  });

  const mensajeOk =
    params.ok === "creada"
      ? "Categoría creada."
      : params.ok === "actualizada"
        ? "Categoría actualizada."
        : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Categorías"
      descripcion="Publicación y orden del catálogo web industrial y automotriz."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5C6675]">
          {categorias.length} categorías
        </p>
        <Link
          href="/panel/categorias/nueva"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          + Nueva categoría
        </Link>
      </div>

      {mensajeOk ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {mensajeOk}
        </p>
      ) : null}

      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
            <tr>
              <th className="px-3 py-2 font-semibold">Línea</th>
              <th className="px-3 py-2 font-semibold">Nombre</th>
              <th className="px-3 py-2 font-semibold">Código</th>
              <th className="px-3 py-2 font-semibold">Web</th>
              <th className="px-3 py-2 font-semibold">Orden</th>
              <th className="px-3 py-2 font-semibold">Productos</th>
              <th className="px-3 py-2 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#EEF0F3] last:border-0"
              >
                <td className="px-3 py-2 capitalize text-[#5C6675]">
                  {c.linea.toLowerCase()}
                </td>
                <td className="px-3 py-2 font-medium text-[#1D2430]">
                  {c.nombre}
                </td>
                <td className="px-3 py-2 font-mono text-[12px] text-[#5C6675]">
                  {c.codigo}
                </td>
                <td className="px-3 py-2">
                  {c.estado !== "ACTIVO" ? (
                    <span className="text-[#5C6675]">Inactiva</span>
                  ) : c.publicada ? (
                    <span className="font-medium text-emerald-700">
                      Publicada
                    </span>
                  ) : (
                    <span className="font-medium text-amber-700">
                      Próximamente
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-[13px]">{c.orden}</td>
                <td className="px-3 py-2 text-[#5C6675]">
                  {c._count.productos}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/panel/categorias/${c.id}/editar`}
                    className="text-sm font-semibold text-[#D96A00] hover:underline"
                  >
                    Editar
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
