import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { accionCrearProveedor } from "@/modulos/proveedores/acciones";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaNuevoProveedor({ searchParams }: Props) {
  await requerirSesion();
  const params = await searchParams;
  const mensajeError =
    params.error === "datos" ? "Revisa los datos del formulario." : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Nuevo proveedor"
      descripcion="Alta rápida de proveedor."
    >
      <p className="mb-4">
        <Link
          href="/panel/proveedores"
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
        action={accionCrearProveedor}
        className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Razón social</span>
          <input
            name="razonSocial"
            required
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Teléfono</span>
          <input
            name="telefono"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Correo</span>
          <input
            name="correo"
            type="email"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Dirección</span>
          <textarea
            name="direccion"
            rows={2}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          Guardar proveedor
        </button>
      </form>
    </PaginaPlaceholderPanel>
  );
}
