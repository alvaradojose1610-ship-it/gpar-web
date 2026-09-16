import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { COL_LG, COL_MD } from "@/utilidades/tabla-panel";

export const dynamic = "force-dynamic";

export default async function PaginaPanelClientes() {
  await requerirPermiso(CODIGOS_PERMISO.CLIENTES_VER, "/panel/clientes");

  const clientes = await prisma.cliente.findMany({
    orderBy: [{ estado: "asc" }, { nombre: "asc" }],
    take: 200,
  });

  return (
    <PaginaPlaceholderPanel
      titulo="Clientes"
      descripcion="Contactos para ventas, cotizaciones y cuentas por cobrar."
    >
      <div className="mb-4 flex justify-end">
        <Link
          href="/panel/clientes/nuevo"
          className="inline-flex min-h-10 items-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
        >
          + Nuevo cliente
        </Link>
      </div>

      {clientes.length === 0 ? (
        <p className="border border-dashed border-[#E4E7EC] bg-white px-4 py-8 text-center text-sm text-[#5C6675]">
          Aún no hay clientes. Crea uno o se crearán al vender en el POS.
        </p>
      ) : (
        <div className="border border-[#E4E7EC] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
              <tr>
                <th className="px-2 py-2 font-semibold sm:px-3">Nombre</th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Empresa
                </th>
                <th className="px-2 py-2 font-semibold sm:px-3">Teléfono</th>
                <th className={`${COL_LG} px-2 py-2 font-semibold sm:px-3`}>
                  Correo
                </th>
                <th className={`${COL_MD} px-2 py-2 font-semibold sm:px-3`}>
                  Estado
                </th>
                <th className="px-2 py-2 font-semibold sm:px-3"> </th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-2 py-2 font-medium text-[#1D2430] sm:px-3">
                    <div>{c.nombre}</div>
                    {c.empresa ? (
                      <div className="mt-0.5 text-[11px] text-[#5C6675] md:hidden">
                        {c.empresa}
                      </div>
                    ) : null}
                  </td>
                  <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {c.empresa || "—"}
                  </td>
                  <td className="px-2 py-2 text-[#5C6675] sm:px-3">
                    {c.telefono || "—"}
                  </td>
                  <td className={`${COL_LG} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {c.correo || "—"}
                  </td>
                  <td className={`${COL_MD} px-2 py-2 text-[#5C6675] sm:px-3`}>
                    {c.estado}
                  </td>
                  <td className="px-2 py-2 text-right sm:px-3">
                    <Link
                      href={`/panel/clientes/${c.id}/editar`}
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
