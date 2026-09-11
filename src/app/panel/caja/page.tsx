import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import {
  accionAbrirCaja,
  accionCerrarCaja,
} from "@/modulos/caja/acciones";
import { obtenerAperturaAbierta } from "@/modulos/caja/servicio-caja";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string; ok?: string }>;
};

const mensajesError: Record<string, string> = {
  monto: "Revisa el monto ingresado.",
  "ya-abierta": "Ya hay una caja abierta.",
  "sin-apertura": "No hay caja abierta para cerrar.",
};

const mensajesOk: Record<string, string> = {
  abierta: "Caja abierta correctamente.",
  cerrada: "Caja cerrada correctamente.",
};

const INGRESOS = new Set([
  "APERTURA",
  "VENTA",
  "COBRO_CUENTA",
  "INGRESO_MANUAL",
]);
const EGRESOS = new Set([
  "ANULACION_VENTA",
  "PAGO_PROVEEDOR",
  "EGRESO_MANUAL",
]);

export default async function PaginaPanelCaja({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.CAJA_VER, "/panel/caja");
  const params = await searchParams;
  const apertura = await obtenerAperturaAbierta();

  const mensajeError = params.error
    ? (mensajesError[params.error] ?? "No se pudo completar la operación.")
    : null;
  const mensajeOk = params.ok ? (mensajesOk[params.ok] ?? null) : null;

  let totalIngresos = 0;
  let totalEgresos = 0;
  let esperado = 0;

  if (apertura) {
    const movimientos = await prisma.movimientoCaja.findMany({
      where: { aperturaCajaId: apertura.id },
      orderBy: { creadoEn: "desc" },
    });
    for (const m of movimientos) {
      const monto = Number(m.monto);
      if (INGRESOS.has(m.tipo)) totalIngresos += monto;
      if (EGRESOS.has(m.tipo)) totalEgresos += monto;
    }
    // APERTURA ya viene en ingresos → esperado = ingresos − egresos
    esperado = Math.round((totalIngresos - totalEgresos) * 100) / 100;
  }

  return (
    <PaginaPlaceholderPanel
      titulo="Caja"
      descripcion="Apertura y cierre de caja para el punto de venta."
    >
      <p className="mb-4">
        <Link
          href="/panel/ventas/nueva"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          Ir al POS →
        </Link>
      </p>

      {mensajeError ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {mensajeError}
        </p>
      ) : null}
      {mensajeOk ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {mensajeOk}
        </p>
      ) : null}

      {apertura ? (
        <div className="grid max-w-xl gap-4 border border-[#E4E7EC] bg-white p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5C6675]">
              Estado
            </p>
            <p className="mt-1 text-lg font-semibold text-[#1D2430]">
              ABIERTA · {apertura.caja.nombre}
            </p>
            <p className="mt-1 text-sm text-[#5C6675]">
              Abierta por {apertura.usuarioApertura.nombre} (
              {apertura.usuarioApertura.usuario}) el{" "}
              {apertura.abiertaEn.toLocaleString("es-VE")}
            </p>
            <p className="mt-1 text-sm text-[#1D2430]">
              Monto apertura: {Number(apertura.montoApertura).toFixed(2)} USD
            </p>
            <div className="mt-3 grid gap-1 border-t border-[#E4E7EC] pt-3 text-sm">
              <p>
                <span className="text-[#5C6675]">Ingresos del turno: </span>
                {totalIngresos.toFixed(2)} USD
              </p>
              <p>
                <span className="text-[#5C6675]">Egresos del turno: </span>
                {totalEgresos.toFixed(2)} USD
              </p>
              <p className="font-semibold text-[#1D2430]">
                Esperado en caja: {esperado.toFixed(2)} USD
              </p>
            </div>
          </div>

          {apertura.movimientos.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#5C6675]">
                Últimos movimientos
              </p>
              <ul className="grid gap-1 text-sm text-[#5C6675]">
                {apertura.movimientos.map((m) => (
                  <li key={m.id}>
                    {m.tipo}
                    {m.referencia ? ` · ${m.referencia}` : ""} ·{" "}
                    {Number(m.monto).toFixed(2)} ·{" "}
                    {m.creadoEn.toLocaleString("es-VE")}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <form
            action={accionCerrarCaja}
            className="grid gap-3 border-t border-[#E4E7EC] pt-4"
          >
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-[#1D2430]">
                Monto de cierre
              </span>
              <input
                name="montoCierre"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={esperado.toFixed(2)}
                className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-[#1D2430]">Observaciones</span>
              <textarea
                name="observaciones"
                rows={2}
                className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center border border-[#1D2430] bg-white px-4 text-sm font-bold text-[#1D2430] hover:bg-[#F7F8FA]"
            >
              Cerrar caja
            </button>
          </form>
        </div>
      ) : (
        <div className="grid max-w-xl gap-4 border border-[#E4E7EC] bg-white p-4">
          <p className="text-sm text-[#5C6675]">
            No hay apertura abierta. Abre la caja para registrar ventas en
            efectivo.
          </p>
          <form action={accionAbrirCaja} className="grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-[#1D2430]">
                Monto de apertura
              </span>
              <input
                name="montoApertura"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue="0"
                className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00]"
            >
              Abrir caja
            </button>
          </form>
        </div>
      )}
    </PaginaPlaceholderPanel>
  );
}
