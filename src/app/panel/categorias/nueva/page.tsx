import Link from "next/link";

import { CampoImagenProducto } from "@/componentes/panel/CampoImagenProducto";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { accionCrearCategoria } from "@/modulos/categorias/acciones";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaNuevaCategoria({ searchParams }: Props) {
  await requerirPermiso(
    CODIGOS_PERMISO.CATEGORIAS_EDITAR,
    "/panel/categorias",
  );
  const params = await searchParams;
  const error =
    params.error === "codigo"
      ? "Ya existe una categoría con ese código en la línea."
      : params.error === "datos"
        ? "Revisa los datos del formulario."
        : params.error === "imagen"
          ? "No se pudo subir la imagen. Revisa el archivo o BLOB_READ_WRITE_TOKEN."
          : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Nueva categoría"
      descripcion="Alta de categoría para el catálogo web."
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
        action={accionCrearCategoria}
        encType="multipart/form-data"
        className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Línea</span>
          <select
            name="linea"
            required
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            defaultValue="INDUSTRIAL"
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
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">
            Código (slug; vacío = desde el nombre)
          </span>
          <input
            name="codigo"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 font-mono"
            placeholder="ej. rodamientos"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Descripción</span>
          <textarea
            name="descripcion"
            rows={2}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Orden</span>
          <input
            name="orden"
            type="number"
            min={0}
            defaultValue={0}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="publicada" />
          <span className="font-semibold text-[#1D2430]">
            Publicada en la web (si no, se muestra Próximamente)
          </span>
        </label>
        <CampoImagenProducto nombreProducto="categoría" />
        <input type="hidden" name="estado" value="ACTIVO" />
        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          Crear categoría
        </button>
      </form>
    </PaginaPlaceholderPanel>
  );
}
