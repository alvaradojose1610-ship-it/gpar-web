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

export default async function PaginaPanelUsuarios({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.USUARIOS_VER, "/panel/usuarios");
  const params = await searchParams;

  const usuarios = await prisma.usuario.findMany({
    orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    include: {
      roles: { include: { rol: true } },
    },
    take: 200,
  });

  const mensajeOk =
    params.ok === "creado"
      ? "Usuario creado."
      : params.ok === "actualizado"
        ? "Usuario actualizado."
        : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Usuarios"
      descripcion="Cuentas del panel interno y asignación de roles."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5C6675]">{usuarios.length} usuarios</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/panel/roles"
            className="inline-flex min-h-10 items-center border border-[#E4E7EC] bg-white px-4 text-sm font-semibold text-[#1D2430] hover:bg-[#F7F8FA]"
          >
            Roles y permisos
          </Link>
          <Link
            href="/panel/usuarios/nuevo"
            className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
          >
            + Nuevo usuario
          </Link>
        </div>
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
              <th className="px-2 py-2 font-semibold sm:px-3">Usuario</th>
              <th className="px-2 py-2 font-semibold sm:px-3">Nombre</th>
              <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                Roles
              </th>
              <th className="px-2 py-2 font-semibold sm:px-3">Estado</th>
              <th className="px-2 py-2 font-semibold sm:px-3"> </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[#EEF0F3] last:border-0"
              >
                <td className="px-2 py-2 font-mono text-[13px] text-[#1D2430] sm:px-3">
                  {u.usuario}
                </td>
                <td className="px-2 py-2 text-[#1D2430] sm:px-3">
                  <div>
                    {[u.nombre, u.apellido].filter(Boolean).join(" ")}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#5C6675] md:hidden">
                    {u.roles.map((ur) => ur.rol.nombre).join(", ") || "—"}
                  </div>
                </td>
                <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                  {u.roles.map((ur) => ur.rol.nombre).join(", ") || "—"}
                </td>
                <td className="px-2 py-2 sm:px-3">
                  <span
                    className={
                      u.activo
                        ? "font-medium text-emerald-700"
                        : "font-medium text-[#5C6675]"
                    }
                  >
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-2 py-2 text-right sm:px-3">
                  <Link
                    href={`/panel/usuarios/${u.id}/editar`}
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
