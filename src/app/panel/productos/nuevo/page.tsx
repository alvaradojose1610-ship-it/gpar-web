import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { accionCrearProducto } from "@/modulos/productos/acciones";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaNuevoProducto({ searchParams }: Props) {
  await requerirSesion();
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
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Línea</span>
          <select
            name="linea"
            required
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            defaultValue="INDUSTRIAL"
          >
            <option value="INDUSTRIAL">Industrial</option>
            <option value="AUTOMOTRIZ">Automotriz</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Categoría</span>
          <select
            name="categoriaId"
            required
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.linea === "AUTOMOTRIZ" ? "Automotriz" : "Industrial"} ·{" "}
                {c.nombre}
              </option>
            ))}
          </select>
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
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Foto (opcional)</span>
          <input
            name="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
          <span className="text-xs text-[#8A94A2]">
            JPG, PNG o WebP · máx. 1.5 MB. Requiere Blob en Vercel.
          </span>
        </label>
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
