import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { accionActualizarUsuario } from "@/modulos/usuarios/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

function mensajeError(codigo?: string) {
  switch (codigo) {
    case "clave":
      return "La clave debe tener al menos 6 caracteres y coincidir.";
    case "usuario":
      return "Ese nombre de usuario ya existe.";
    case "correo":
      return "Ese correo ya está en uso.";
    case "ultimo-admin":
      return "No puedes quitar el último administrador activo.";
    case "auto":
      return "No puedes desactivar tu propia cuenta.";
    case "datos":
      return "Revisa los datos del formulario.";
    default:
      return null;
  }
}

export default async function PaginaEditarUsuario({
  params,
  searchParams,
}: Props) {
  await requerirPermiso(CODIGOS_PERMISO.USUARIOS_EDITAR, "/panel/usuarios");
  const { id } = await params;
  const q = await searchParams;
  const error = mensajeError(q.error);

  const [usuario, roles] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id },
      include: { roles: true },
    }),
    prisma.rol.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  if (!usuario) notFound();

  const rolesAsignados = new Set(usuario.roles.map((ur) => ur.rolId));

  return (
    <PaginaPlaceholderPanel
      titulo="Editar usuario"
      descripcion={`Cuenta ${usuario.usuario}`}
    >
      <p className="mb-4">
        <Link
          href="/panel/usuarios"
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
        action={accionActualizarUsuario}
        className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4"
      >
        <input type="hidden" name="id" value={usuario.id} />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Nombre</span>
          <input
            name="nombre"
            required
            defaultValue={usuario.nombre}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Apellido</span>
          <input
            name="apellido"
            defaultValue={usuario.apellido ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Usuario</span>
          <input
            name="usuario"
            required
            defaultValue={usuario.usuario}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 font-mono"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Correo</span>
          <input
            name="correo"
            type="email"
            defaultValue={usuario.correo ?? ""}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">
            Nueva clave (opcional)
          </span>
          <input
            name="clave"
            type="password"
            minLength={6}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Confirmar clave</span>
          <input
            name="claveConfirmacion"
            type="password"
            minLength={6}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>

        <fieldset className="grid gap-2 border border-[#E4E7EC] p-3">
          <legend className="px-1 text-sm font-semibold text-[#1D2430]">
            Roles
          </legend>
          {roles.map((rol) => (
            <label key={rol.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="rolesIds"
                value={rol.id}
                defaultChecked={rolesAsignados.has(rol.id)}
              />
              <span>{rol.nombre}</span>
            </label>
          ))}
        </fieldset>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={usuario.activo}
          />
          <span className="font-semibold text-[#1D2430]">Usuario activo</span>
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
