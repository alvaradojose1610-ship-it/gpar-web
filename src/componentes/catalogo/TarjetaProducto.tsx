"use client";

import Image from "next/image";
import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";
import type { ProductoCatalogo } from "@/datos/tipos-catalogo";
import { cn } from "@/utilidades/cn";

type TarjetaProductoProps = {
  producto: ProductoCatalogo;
  categoriaNombre?: string;
  compacta?: boolean;
};

function specsDe(producto: ProductoCatalogo): string[] {
  if (producto.linea === "industrial") {
    return producto.especificaciones?.slice(0, 3) ?? [];
  }
  const specs: string[] = [];
  if (producto.tamano) specs.push(producto.tamano);
  if (producto.posicion) specs.push(producto.posicion);
  if (producto.vehiculo) specs.push(producto.vehiculo);
  return specs.slice(0, 3);
}

function pillPrincipal(producto: ProductoCatalogo): string | null {
  if (producto.linea === "industrial") {
    return producto.subcategoria ?? null;
  }
  return producto.tipo || null;
}

export function TarjetaProducto({
  producto,
  categoriaNombre,
  compacta = false,
}: TarjetaProductoProps) {
  const { estaEnCotizacion, agregar, abrirDrawer } = useCotizacion();
  const enLista = estaEnCotizacion(producto.codigo);
  const specs = specsDe(producto);
  const pill = pillPrincipal(producto);

  return (
    <article
      className={cn(
        "flex flex-col border border-gpar-line bg-gpar-bg transition-[border-color] duration-[180ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:border-gpar-orange",
        enLista && "border-gpar-orange",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border-b border-gpar-line-soft bg-gpar-surface",
          compacta ? "h-[110px] sm:h-[130px]" : "h-[120px] sm:h-[150px]",
        )}
      >
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-cover"
            sizes="(max-width:480px) 100vw, (max-width:1024px) 50vw, 25vw"
            unoptimized={producto.imagen.startsWith("http")}
          />
        ) : (
          <div className="placeholder-media flex h-full items-center justify-center">
            <span className="px-3 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-gpar-ink-3">
              {producto.codigo}
            </span>
          </div>
        )}
        <span className="absolute right-2 top-2 border border-gpar-line bg-gpar-bg px-1.5 py-0.5 font-mono text-[10px] text-gpar-ink">
          Consultar
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-[15px]">
        <span className="font-mono text-[11.5px] text-gpar-ink-3">
          {producto.codigo}
        </span>
        <h3 className="text-[15px] font-bold leading-[1.25] text-gpar-ink">
          {producto.nombre}
        </h3>

        {specs.length > 0 ? (
          <div className="flex flex-wrap gap-3 border-t border-dashed border-gpar-line pt-2.5 text-[12.5px] text-gpar-ink-2">
            {specs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          {pill ? (
            <span className="border border-gpar-orange-border bg-gpar-orange-soft px-1.5 py-0.5 text-[10.5px] uppercase tracking-[0.05em] text-gpar-orange-ink">
              {pill}
            </span>
          ) : null}
          {producto.marca ? (
            <span className="border border-gpar-line px-1.5 py-0.5 text-[10.5px] uppercase tracking-[0.05em] text-gpar-ink-2">
              {producto.marca}
            </span>
          ) : null}
          {categoriaNombre ? (
            <span className="border border-gpar-line px-1.5 py-0.5 text-[10.5px] uppercase tracking-[0.05em] text-gpar-ink-2">
              {categoriaNombre}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-1.5 sm:flex-row">
          <button
            type="button"
            className={cn(
              "inline-flex min-h-11 flex-1 items-center justify-center px-2.5 text-[13px] font-bold transition-colors",
              enLista
                ? "bg-gpar-ink text-white"
                : "border border-gpar-ink bg-gpar-bg text-gpar-ink hover:bg-gpar-ink hover:text-white",
            )}
            onClick={() => {
              if (!enLista) agregar(producto.codigo, 1, producto.nombre);
            }}
          >
            {enLista ? (
              "✓ En la cotización"
            ) : (
              <>
                <span className="sm:hidden">+ Agregar</span>
                <span className="hidden sm:inline">+ Agregar a la cotización</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 flex-1 items-center justify-center border border-gpar-line bg-gpar-surface px-2.5 text-[13px] font-semibold text-gpar-ink hover:border-gpar-orange"
            onClick={() => {
              if (!enLista) agregar(producto.codigo, 1, producto.nombre);
              abrirDrawer();
            }}
          >
            Cotizar
          </button>
        </div>
      </div>
    </article>
  );
}
