import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { accionActualizarCliente } from "@/modulos/clientes/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function PaginaEditarCliente({
  params,
  searchParams,
}: Props) {
  await requerirPermiso(CODIGOS_PERMISO.CLIENTES_EDITAR, "/panel/clientes");
  const { id } = await params;
  const q = await searchParams;
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) notFound();

  return (
    <PaginaPlaceholderPanel titulo="Editar cliente" descripcion={cliente.nombre}>
      <p className="mb-4">
        <Link
          href="/panel/clientes"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Volver
        </Link>
      </p>
      {q.error === "datos" ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Revisa los datos del formulario.
        </p>
      ) : null}
      <form
        action={accionActualizarCliente}
        className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <input type="hidden" name="id" value={cliente.id} />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Nombre</span>
          <input
            name="nombre"
            required
            defaultValue={cliente.nombre}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Empresa</span>
          <input
            name="empresa"
            defaultValue={cliente.empresa ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Teléfono</span>
          <input
            name="telefono"
            defaultValue={cliente.telefono ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Correo</span>
          <input
            name="correo"
            type="email"
            defaultValue={cliente.correo ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Dirección</span>
          <textarea
            name="direccion"
            rows={2}
            defaultValue={cliente.direccion ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={cliente.estado === "ACTIVO"}
          />
          <span className="font-semibold">Activo</span>
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
        >
          Guardar
        </button>
      </form>
    </PaginaPlaceholderPanel>
  );
}
