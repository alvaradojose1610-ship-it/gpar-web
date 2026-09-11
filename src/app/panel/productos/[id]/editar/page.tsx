import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { accionActualizarProducto } from "@/modulos/productos/acciones";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaEditarProducto({
  params,
  searchParams,
}: Props) {
  await requerirSesion();
  const { id } = await params;
  const q = await searchParams;

  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) notFound();

  const error =
    q.error === "imagen"
      ? "No se pudo subir la imagen (revisa BLOB_READ_WRITE_TOKEN o el formato)."
      : q.error === "datos"
        ? "Revisa los datos."
        : null;

  return (
    <PaginaPlaceholderPanel
      titulo={`Editar ${producto.codigo}`}
      descripcion={producto.nombre}
    >
      <p className="mb-4">
        <Link
          href="/panel/productos"
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

      {producto.imagenUrl ? (
        <div className="relative mb-4 h-40 w-56 overflow-hidden border border-[#E4E7EC] bg-[#F7F8FA]">
          <Image
            src={producto.imagenUrl}
            alt={producto.nombre}
            fill
            className="object-cover"
          />
        </div>
      ) : null}

      <form
        action={accionActualizarProducto}
        encType="multipart/form-data"
        className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <input type="hidden" name="id" value={producto.id} />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Nombre</span>
          <input
            name="nombre"
            required
            defaultValue={producto.nombre}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Descripción</span>
          <textarea
            name="descripcion"
            rows={2}
            defaultValue={producto.descripcion ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Aplicación</span>
          <input
            name="aplicacion"
            defaultValue={producto.aplicacion ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Modelo</span>
          <input
            name="modelo"
            defaultValue={producto.modelo ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Tipo</span>
          <input
            name="tipo"
            defaultValue={producto.tipo ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Tamaño</span>
          <input
            name="tamano"
            defaultValue={producto.tamano ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Nueva foto</span>
          <input
            name="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        {producto.imagenUrl ? (
          <label className="flex items-center gap-2 text-sm">
            <input name="quitarImagen" type="checkbox" />
            Quitar foto actual
          </label>
        ) : null}
        <label className="flex items-center gap-2 text-sm">
          <input
            name="visibleWeb"
            type="checkbox"
            defaultChecked={producto.visibleWeb}
          />
          Visible en la web
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="destacado"
            type="checkbox"
            defaultChecked={producto.destacado}
          />
          Destacado en home
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
        >
          Guardar cambios
        </button>
      </form>
    </PaginaPlaceholderPanel>
  );
}
