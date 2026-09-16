import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { COL_MD } from "@/utilidades/tabla-panel";

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
      descripcion="Publicación y orden del catálogo web industrial y carga pesada."
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

      <div className="border border-[#E4E7EC] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
            <tr>
              <th className="px-2 py-2 font-semibold sm:px-3">Nombre</th>
              <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                Línea
              </th>
              <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                Código
              </th>
              <th className="px-2 py-2 font-semibold sm:px-3">Web</th>
              <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                Orden
              </th>
              <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                Productos
              </th>
              <th className="px-2 py-2 font-semibold sm:px-3"> </th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#EEF0F3] last:border-0"
              >
                <td className="px-2 py-2 font-medium text-[#1D2430] sm:px-3">
                  <div>{c.nombre}</div>
                  <div className="mt-0.5 text-[11px] capitalize text-[#5C6675] md:hidden">
                    {c.linea.toLowerCase().replace("_", " ")} · {c.codigo}
                  </div>
                </td>
                <td
                  className={`${COL_MD} px-2 py-2 capitalize text-[#5C6675] sm:px-3`}
                >
                  {c.linea.toLowerCase().replace("_", " ")}
                </td>
                <td
                  className={`${COL_MD} px-2 py-2 font-mono text-[12px] text-[#5C6675] sm:px-3`}
                >
                  {c.codigo}
                </td>
                <td className="px-2 py-2 sm:px-3">
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
                <td
                  className={`${COL_MD} px-2 py-2 font-mono text-[13px] sm:px-3`}
                >
                  {c.orden}
                </td>
                <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                  {c._count.productos}
                </td>
                <td className="px-2 py-2 text-right sm:px-3">
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
