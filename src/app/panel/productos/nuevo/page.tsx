import Link from "next/link";

import { CampoImagenProducto } from "@/componentes/panel/CampoImagenProducto";
import { CamposLineaCategoria } from "@/componentes/panel/CamposLineaCategoria";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { accionCrearProducto } from "@/modulos/productos/acciones";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaNuevoProducto({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.PRODUCTOS_EDITAR, "/panel/productos");
  const params = await searchParams;
  const categorias = await prisma.categoria.findMany({
    where: { estado: "ACTIVO" },
    orderBy: [{ linea: "asc" }, { nombre: "asc" }],
  });

  const mensajeError =
    params.error === "codigo"
      ? "Ese código ya existe."
      : params.error === "datos"
        ? "Revisa los datos del formulario."
        : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Nuevo producto"
      descripcion="Alta rápida al catálogo interno."
    >
      <p className="mb-4">
        <Link
          href="/panel/productos"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Volver
        </Link>
      </p>

      {mensajeError ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {mensajeError}
        </p>
      ) : null}

      <form
        action={accionCrearProducto}
        encType="multipart/form-data"
        className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Código</span>
          <input
            name="codigo"
            required
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Nombre</span>
          <input
            name="nombre"
            required
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <CamposLineaCategoria
          categorias={categorias.map((c) => ({
            id: c.id,
            nombre: c.nombre,
            linea: c.linea,
          }))}
        />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Descripción</span>
          <textarea
            name="descripcion"
            rows={2}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Aplicación</span>
          <input
            name="aplicacion"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Modelo</span>
          <input
            name="modelo"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">
            Tipo (automotriz)
          </span>
          <input
            name="tipo"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">
            Tamaño (automotriz)
          </span>
          <input
            name="tamano"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <CampoImagenProducto />
        <label className="flex items-center gap-2 text-sm text-[#1D2430]">
          <input name="visibleWeb" type="checkbox" defaultChecked />
          Visible en la web
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          Guardar producto
        </button>
      </form>
    </PaginaPlaceholderPanel>
  );
}
