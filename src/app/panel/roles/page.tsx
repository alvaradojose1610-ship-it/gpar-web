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

export default async function PaginaPanelRoles({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.USUARIOS_VER, "/panel/roles");
  const params = await searchParams;

  const roles = await prisma.rol.findMany({
    orderBy: { nombre: "asc" },
    include: {
      _count: { select: { permisos: true, usuarios: true } },
    },
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Roles"
      descripcion="Roles del sistema y cantidad de permisos asignados."
    >
      <p className="mb-4">
        <Link
          href="/panel/usuarios"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Usuarios
        </Link>
      </p>

      {params.ok === "permisos" ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Permisos del rol actualizados. Las sesiones afectadas se invalidan.
        </p>
      ) : null}

      <div className="border border-[#E4E7EC] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
            <tr>
              <th className="px-2 py-2 font-semibold sm:px-3">Rol</th>
              <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                Código
              </th>
              <th className="px-2 py-2 font-semibold sm:px-3">Permisos</th>
              <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                Usuarios
              </th>
              <th className="px-2 py-2 font-semibold sm:px-3"> </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr
                key={rol.id}
                className="border-b border-[#EEF0F3] last:border-0"
              >
                <td className="px-2 py-2 font-medium text-[#1D2430] sm:px-3">
                  {rol.nombre}
                  {rol.esSistema ? (
                    <span className="ml-2 font-mono text-[11px] text-[#5C6675]">
                      sistema
                    </span>
                  ) : null}
                </td>
                <td
                  className={`${COL_MD} px-2 py-2 font-mono text-[13px] text-[#5C6675] sm:px-3`}
                >
                  {rol.codigo}
                </td>
                <td className="px-2 py-2 text-[#5C6675] sm:px-3">
                  {rol._count.permisos}
                </td>
                <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                  {rol._count.usuarios}
                </td>
                <td className="px-2 py-2 text-right sm:px-3">
                  <Link
                    href={`/panel/roles/${rol.id}`}
                    className="text-sm font-semibold text-[#D96A00] hover:underline"
                  >
                    Permisos
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
