"use client";

import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";

type Props = {
  codigo: string;
  nombre?: string;
};

export function BotonAgregarCotizacion({ codigo, nombre }: Props) {
  const { estaEnCotizacion, agregar, abrirDrawer } = useCotizacion();
  const enLista = estaEnCotizacion(codigo);

  return (
    <button
      type="button"
      onClick={() => {
        if (enLista) {
          abrirDrawer();
          return;
        }
        agregar(codigo, 1, nombre);
        abrirDrawer();
      }}
      className={
        enLista
          ? "inline-flex min-h-11 items-center justify-center bg-gpar-ink px-6 text-sm font-bold text-white"
          : "inline-flex min-h-11 items-center justify-center bg-gpar-orange px-6 text-sm font-bold text-gpar-ink hover:bg-gpar-orange-ink"
      }
    >
      {enLista ? "✓ En la cotización" : "+ Agregar a la cotización"}
    </button>
  );
}
