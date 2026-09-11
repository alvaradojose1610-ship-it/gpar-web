import Link from "next/link";
import { notFound } from "next/navigation";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import {
  requerirPermiso,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";
import { accionRegistrarPagoCxP } from "@/modulos/cuentas/acciones";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
};

export default async function PaginaDetalleCxP({ params, searchParams }: Props) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.CUENTAS_VER,
    "/panel/cuentas-por-pagar",
  );
  const { id } = await params;
  const q = await searchParams;

  const cuenta = await prisma.cuentaPorPagar.findUnique({
    where: { id },
    include: {
      proveedor: true,
      compra: true,
      pagos: { orderBy: { creadoEn: "desc" } },
    },
  });
  if (!cuenta) notFound();

  const puedeEditar =
    tienePermiso(sesion, CODIGOS_PERMISO.CUENTAS_EDITAR) &&
    cuenta.estado !== "PAGADA" &&
    cuenta.estado !== "ANULADA";

  return (
    <PaginaPlaceholderPanel
      titulo={`CxP · ${cuenta.compra.numero}`}
      descripcion={`Saldo ${Number(cuenta.saldo).toFixed(2)} de ${Number(cuenta.total).toFixed(2)} · ${cuenta.estado}`}
    >
      <p className="mb-4">
        <Link
          href="/panel/cuentas-por-pagar"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← CxP
        </Link>
      </p>

      {q.ok === "pago" ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Pago registrado.
        </p>
      ) : null}

      <p className="mb-4 text-sm">
        Proveedor: <strong>{cuenta.proveedor.razonSocial}</strong>
      </p>

      {puedeEditar ? (
        <form
          action={accionRegistrarPagoCxP}
          className="mb-6 grid max-w-md gap-3 border border-[#E4E7EC] bg-white p-4"
        >
          <input type="hidden" name="cuentaId" value={cuenta.id} />
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Monto</span>
            <input
              name="monto"
              type="number"
              step="0.01"
              min={0.01}
              max={Number(cuenta.saldo)}
              required
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Método</span>
            <select
              name="metodoPago"
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
              defaultValue="TRANSFERENCIA"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="PAGO_MOVIL">Pago móvil</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="OTRO">Otro</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Referencia</span>
            <input
              name="referencia"
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
          >
            Registrar pago
          </button>
        </form>
      ) : null}

      <h2 className="mb-2 text-sm font-semibold uppercase text-[#5C6675]">
        Pagos
      </h2>
      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
            <tr>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Monto</th>
              <th className="px-3 py-2">Método</th>
              <th className="px-3 py-2">Ref.</th>
            </tr>
          </thead>
          <tbody>
            {cuenta.pagos.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-3 py-2 text-xs">
                  {p.creadoEn.toLocaleString("es-VE")}
                </td>
                <td className="px-3 py-2">{Number(p.monto).toFixed(2)}</td>
                <td className="px-3 py-2">{p.metodoPago}</td>
                <td className="px-3 py-2">{p.referencia || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PaginaPlaceholderPanel>
  );
}
