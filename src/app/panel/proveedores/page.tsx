import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { COL_LG, COL_MD } from "@/utilidades/tabla-panel";

export const dynamic = "force-dynamic";

export default async function PaginaPanelProveedores() {
  await requerirPermiso(CODIGOS_PERMISO.PROVEEDORES_VER, "/panel/proveedores");

  const proveedores = await prisma.proveedor.findMany({
    orderBy: [{ estado: "asc" }, { razonSocial: "asc" }],
    take: 200,
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Proveedores"
      descripcion="Directorio de proveedores conectado a la base de datos."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5C6675]">
          {proveedores.length} activos
        </p>
        <Link
          href="/panel/proveedores/nuevo"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
        >
          + Nuevo proveedor
        </Link>
      </div>

      {proveedores.length === 0 ? (
        <p className="border border-dashed border-[#E4E7EC] bg-white px-4 py-8 text-center text-sm text-[#5C6675]">
          Todavía no hay proveedores. Crea el primero.
        </p>
      ) : (
        <div className="border border-[#E4E7EC] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
              <tr>
                <th className="px-2 py-2 font-semibold sm:px-3">Razón social</th>
                <th className="px-2 py-2 font-semibold sm:px-3">Teléfono</th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Correo
                </th>
                <th className={`${COL_LG} px-2 py-2 font-semibold sm:px-3`}>
                  Dirección
                </th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Estado
                </th>
                <th className="px-2 py-2 font-semibold sm:px-3"> </th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-2 py-2 font-medium text-[#1D2430] sm:px-3">
                    {p.razonSocial}
                  </td>
                  <td className="px-2 py-2 text-[#5C6675] sm:px-3">
                    {p.telefono || "—"}
                  </td>
                  <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {p.correo || "—"}
                  </td>
                  <td className={`${COL_LG} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {p.direccion || "—"}
                  </td>
                  <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {p.estado}
                  </td>
                  <td className="px-2 py-2 text-right sm:px-3">
                    <Link
                      href={`/panel/proveedores/${p.id}/editar`}
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
      )}
    </PaginaPlaceholderPanel>
  );
}
