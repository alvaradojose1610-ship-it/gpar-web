"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TarjetaProducto } from "@/componentes/catalogo/TarjetaProducto";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import type { ProductoCatalogo } from "@/datos/tipos-catalogo";
import { cn } from "@/utilidades/cn";

type VistaCatalogoCategoriaProps = {
  linea: "industrial" | "automotriz";
  categoriaNombre: string;
  categoriaDescripcion: string;
  subcategorias: string[];
  productos: ProductoCatalogo[];
  publicada: boolean;
};

export function VistaCatalogoCategoria({
  linea,
  categoriaNombre,
  categoriaDescripcion,
  subcategorias,
  productos,
  publicada,
}: VistaCatalogoCategoriaProps) {
  const [subfiltro, setSubfiltro] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    if (!subfiltro) return productos;
    return productos.filter((p) => {
      if (p.linea === "industrial") {
        return p.subcategoria === subfiltro;
      }
      return p.tipo === subfiltro;
    });
  }, [productos, subfiltro]);

  return (
    <>
      <div className="border-b border-gpar-line bg-gpar-surface">
        <Contenedor className="flex flex-wrap gap-2.5 py-[11px] text-[13px] text-gpar-ink-2">
          <Link href="/" className="hover:text-gpar-ink">
            Inicio
          </Link>
          <span>/</span>
          <Link href={`/${linea}`} className="hover:text-gpar-ink">
            {linea === "industrial" ? "Industrial" : "Automotriz"}
          </Link>
          <span>/</span>
          <b className="text-gpar-ink">{categoriaNombre}</b>
        </Contenedor>
      </div>

      <div className="border-b border-gpar-line">
        <Contenedor className="flex flex-wrap items-end justify-between gap-3 py-5 sm:gap-6 sm:py-8">
          <div className="min-w-0 flex-1">
            <p className="mb-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-gpar-orange-ink">
              {linea === "industrial"
                ? "Repuestos industriales"
                : "Repuestos automotrices"}
            </p>
            <h1 className="font-display text-[clamp(28px,4.4vw,46px)] font-extrabold uppercase leading-none text-gpar-ink">
              {categoriaNombre}
            </h1>
            <p className="mt-2 max-w-[54ch] text-[14.5px] text-gpar-ink-2 sm:mt-3 sm:text-[15.5px]">
              {categoriaDescripcion}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-gpar-ink underline-offset-2 hover:underline sm:min-h-11 sm:border sm:border-gpar-ink sm:bg-gpar-bg sm:px-5 sm:no-underline sm:hover:bg-gpar-ink sm:hover:text-white sm:hover:no-underline"
          >
            ← Volver
          </Link>
        </Contenedor>
      </div>

      {publicada && subcategorias.length > 0 ? (
        <div className="sticky z-40 border-b border-gpar-line bg-gpar-surface top-[var(--gp-header-h)]">
          <Contenedor className="flex flex-wrap items-center gap-2 py-[11px]">
            <button
              type="button"
              aria-pressed={subfiltro === null}
              className={cn(
                "inline-flex min-h-9 items-center border px-[13px] py-[7px] text-[13px] font-semibold",
                subfiltro === null
                  ? "border-gpar-ink bg-gpar-ink text-white"
                  : "border-gpar-line bg-gpar-bg text-gpar-ink-2",
              )}
              onClick={() => setSubfiltro(null)}
            >
              Todos
            </button>
            {subcategorias.map((sub) => (
              <button
                key={sub}
                type="button"
                aria-pressed={subfiltro === sub}
                className={cn(
                  "inline-flex min-h-9 items-center border px-[13px] py-[7px] text-[13px] font-semibold",
                  subfiltro === sub
                    ? "border-gpar-ink bg-gpar-ink text-white"
                    : "border-gpar-line bg-gpar-bg text-gpar-ink-2",
                )}
                onClick={() => setSubfiltro(sub)}
              >
                {sub}
              </button>
            ))}
            <span className="ml-auto font-mono text-[11.5px] text-gpar-ink-3">
              {filtrados.length} de {productos.length}
            </span>
          </Contenedor>
        </div>
      ) : null}

      <section className="seccion">
        <Contenedor>
          {!publicada || productos.length === 0 ? (
            <div className="border border-dashed border-gpar-line bg-gpar-surface px-6 py-12 text-center">
              <p className="font-display text-2xl font-extrabold uppercase text-gpar-ink">
                {publicada ? "Sin resultados" : "Próximamente"}
              </p>
              <p className="mt-2 text-gpar-ink-2">
                {publicada
                  ? "Todavía no hay referencias cargadas en esta categoría."
                  : "El surtido de esta categoría se confirmará con GPar."}
              </p>
              <Link
                href="/cotizar"
                className="mt-5 inline-flex min-h-11 items-center justify-center bg-gpar-orange px-6 text-sm font-bold text-gpar-ink hover:bg-gpar-orange-ink"
              >
                Solicitar el producto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtrados.map((producto) => (
                <TarjetaProducto
                  key={producto.id}
                  producto={producto}
                  categoriaNombre={categoriaNombre}
                />
              ))}
            </div>
          )}
        </Contenedor>
      </section>
    </>
  );
}
