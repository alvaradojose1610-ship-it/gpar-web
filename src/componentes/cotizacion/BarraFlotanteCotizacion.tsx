"use client";

import Link from "next/link";
import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";

export function BarraFlotanteCotizacion() {
  const { totalUnidades, abrirDrawer } = useCotizacion();

  if (totalUnidades === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] border-t-[3px] border-gpar-orange bg-gpar-bg shadow-[0_-6px_24px_rgba(29,36,48,0.08)]">
      <div className="contenedor flex flex-wrap items-center justify-between gap-4 py-[13px]">
        <p className="text-sm text-gpar-ink">
          Tienes{" "}
          <b className="font-mono text-gpar-orange-ink">
            {totalUnidades} {totalUnidades === 1 ? "ítem" : "ítems"}
          </b>{" "}
          en tu cotización
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center border border-gpar-ink bg-gpar-bg px-5 text-sm font-semibold text-gpar-ink hover:bg-gpar-ink hover:text-white"
            onClick={abrirDrawer}
          >
            Ver lista
          </button>
          <Link
            href="/cotizar"
            className="inline-flex min-h-11 items-center justify-center bg-gpar-orange px-5 text-sm font-bold text-gpar-ink hover:bg-gpar-orange-ink"
          >
            Solicitar cotización
          </Link>
        </div>
      </div>
    </div>
  );
}
