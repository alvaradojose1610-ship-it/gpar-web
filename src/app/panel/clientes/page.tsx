import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaPanelClientes() {
  await requerirSesion();

  const clientes = await prisma.cliente.findMany({
    where: { estado: "ACTIVO" },
    orderBy: { nombre: "asc" },
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
        <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
              <tr>
                <th className="px-3 py-2 font-semibold">Nombre</th>
                <th className="px-3 py-2 font-semibold">Empresa</th>
                <th className="px-3 py-2 font-semibold">Teléfono</th>
                <th className="px-3 py-2 font-semibold">Correo</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[#EEF0F3] last:border-0"
                >
                  <td className="px-3 py-2 font-medium text-[#1D2430]">
                    {c.nombre}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {c.empresa || "—"}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {c.telefono || "—"}
                  </td>
                  <td className="px-3 py-2 text-[#5C6675]">
                    {c.correo || "—"}
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
