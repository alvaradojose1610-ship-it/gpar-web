import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import {
  CODIGOS_PERMISO,
  LISTA_PERMISOS,
} from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { accionActualizarPermisosRol } from "@/modulos/usuarios/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
};

export default async function PaginaEditarPermisosRol({
  params,
  searchParams,
}: Props) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.USUARIOS_VER,
    "/panel/roles",
  );
  const { id } = await params;
  const q = await searchParams;

  const rol = await prisma.rol.findUnique({
    where: { id },
    include: { permisos: { include: { permiso: true } } },
  });
  if (!rol) notFound();

  const asignados = new Set(rol.permisos.map((rp) => rp.permiso.codigo));
  const porModulo = new Map<
    string,
    Array<(typeof LISTA_PERMISOS)[number]>
  >();
  for (const p of LISTA_PERMISOS) {
    const lista = porModulo.get(p.modulo) ?? [];
    lista.push(p);
    porModulo.set(p.modulo, lista);
  }

  const puedeEditar = sesion.permisos.includes(CODIGOS_PERMISO.USUARIOS_EDITAR);

  return (
    <PaginaPlaceholderPanel
      titulo={`Rol: ${rol.nombre}`}
      descripcion={rol.descripcion ?? `Código ${rol.codigo}`}
    >
      <p className="mb-4">
        <Link
          href="/panel/roles"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Roles
        </Link>
      </p>

      {q.ok === "permisos" ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Permisos guardados.
        </p>
      ) : null}

      <form
        action={accionActualizarPermisosRol}
        className="grid max-w-2xl gap-4 border border-[#E4E7EC] bg-white p-4"
      >
        <input type="hidden" name="rolId" value={rol.id} />

        {[...porModulo.entries()].map(([modulo, permisos]) => (
          <fieldset
            key={modulo}
            className="grid gap-2 border border-[#E4E7EC] p-3"
          >
            <legend className="px-1 text-sm font-semibold uppercase tracking-[0.06em] text-[#5C6675]">
              {modulo}
            </legend>
            {permisos.map((p) => (
              <label key={p.codigo} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  name="permisos"
                  value={p.codigo}
                  defaultChecked={asignados.has(p.codigo)}
                  disabled={!puedeEditar}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium text-[#1D2430]">{p.nombre}</span>
                  <span className="block font-mono text-[11px] text-[#5C6675]">
                    {p.codigo}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        ))}

        {puedeEditar ? (
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
          >
            Guardar permisos
          </button>
        ) : null}
      </form>
    </PaginaPlaceholderPanel>
  );
}
