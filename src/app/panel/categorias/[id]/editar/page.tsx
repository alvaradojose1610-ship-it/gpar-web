import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { accionActualizarCategoria } from "@/modulos/categorias/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaEditarCategoria({
  params,
  searchParams,
}: Props) {
  await requerirPermiso(
    CODIGOS_PERMISO.CATEGORIAS_EDITAR,
    "/panel/categorias",
  );
  const { id } = await params;
  const q = await searchParams;

  const categoria = await prisma.categoria.findUnique({ where: { id } });
  if (!categoria) notFound();

  const error =
    q.error === "codigo"
      ? "Ya existe una categoría con ese código en la línea."
      : q.error === "datos"
        ? "Revisa los datos del formulario."
        : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Editar categoría"
      descripcion={categoria.nombre}
    >
      <p className="mb-4">
        <Link
          href="/panel/categorias"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Volver
        </Link>
      </p>

      {error ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <form
        action={accionActualizarCategoria}
        className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <input type="hidden" name="id" value={categoria.id} />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Línea</span>
          <select
            name="linea"
            required
            defaultValue={categoria.linea}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          >
            <option value="INDUSTRIAL">Industrial</option>
            <option value="CARGA_PESADA">Carga Pesada</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Nombre</span>
          <input
            name="nombre"
            required
            defaultValue={categoria.nombre}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Código</span>
          <input
            name="codigo"
            required
            defaultValue={categoria.codigo}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 font-mono"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Descripción</span>
          <textarea
            name="descripcion"
            rows={2}
            defaultValue={categoria.descripcion ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Orden</span>
          <input
            name="orden"
            type="number"
            min={0}
            defaultValue={categoria.orden}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Estado</span>
          <select
            name="estado"
            defaultValue={categoria.estado}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="publicada"
            defaultChecked={categoria.publicada}
          />
          <span className="font-semibold text-[#1D2430]">
            Publicada en la web
          </span>
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          Guardar cambios
        </button>
      </form>
    </PaginaPlaceholderPanel>
  );
}
