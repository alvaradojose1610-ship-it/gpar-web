"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";
import { empresa } from "@/configuracion/empresa";
import { categoriasCatalogo } from "@/datos/catalogo";

function nombreCategoria(categoriaId: string): string {
  return (
    categoriasCatalogo.find((c) => c.id === categoriaId)?.nombre ?? categoriaId
  );
}

export function DrawerCotizacion() {
  const {
    items,
    drawerAbierto,
    cerrarDrawer,
    establecerCantidad,
    quitar,
    mensajeWhatsApp,
  } = useCotizacion();
  const tituloId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerAbierto) return;

    const anterior = document.activeElement as HTMLElement | null;
    cerrarRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrarDrawer();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focables.length === 0) return;
      const primero = focables[0];
      const ultimo = focables[focables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [drawerAbierto, cerrarDrawer]);

  if (!drawerAbierto) return null;

  const whatsappHref = empresa.contacto.whatsapp.href
    ? `${empresa.contacto.whatsapp.href}?text=${encodeURIComponent(mensajeWhatsApp)}`
    : null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[80] cursor-default border-0 bg-[rgba(29,36,48,0.45)] p-0"
        aria-label="Cerrar cotización"
        onClick={cerrarDrawer}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[420px] flex-col bg-gpar-bg shadow-[-12px_0_40px_rgba(29,36,48,0.18)]"
      >
        <div className="flex items-center justify-between border-b border-gpar-line px-[22px] py-[18px]">
          <h2
            id={tituloId}
            className="font-display text-2xl font-extrabold uppercase text-gpar-ink"
          >
            Mi cotización
          </h2>
          <button
            ref={cerrarRef}
            type="button"
            aria-label="Cerrar"
            className="inline-flex size-11 items-center justify-center border border-gpar-line bg-gpar-bg"
            onClick={cerrarDrawer}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/iconos/cerrar.svg" alt="" width={20} height={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[22px] py-2">
          {items.length === 0 ? (
            <p className="px-2 py-14 text-center text-gpar-ink-2">
              Tu lista está vacía.
              <br />
              Escoge una categoría y agrega productos.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.codigo}
                className="flex gap-3 border-b border-gpar-line-soft py-[15px]"
              >
                <div
                  className="placeholder-media size-[54px] shrink-0 border border-gpar-line-soft"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold leading-[1.25] text-gpar-ink">
                    {item.producto.nombre}
                  </div>
                  <div className="mt-0.5 font-mono text-[11.5px] text-gpar-ink-3">
                    {item.codigo} · {nombreCategoria(item.producto.categoriaId)}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Quitar una unidad"
                      className="inline-flex size-8 items-center justify-center border border-gpar-line bg-gpar-surface font-semibold"
                      onClick={() =>
                        establecerCantidad(item.codigo, item.cantidad - 1)
                      }
                    >
                      −
                    </button>
                    <span className="min-w-[22px] text-center font-mono text-[13px]">
                      {item.cantidad}
                    </span>
                    <button
                      type="button"
                      aria-label="Agregar una unidad"
                      className="inline-flex size-8 items-center justify-center border border-gpar-line bg-gpar-surface font-semibold"
                      onClick={() =>
                        establecerCantidad(item.codigo, item.cantidad + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto border-0 bg-transparent text-[12.5px] text-gpar-ink-3 underline"
                      onClick={() => quitar(item.codigo)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2.5 border-t border-gpar-line px-[22px] py-[18px]">
          <small className="text-[12.5px] text-gpar-ink-2">
            Sin pago en línea: envías la lista y GPar te responde con precio,
            disponibilidad y tiempo de entrega.
          </small>
          <Link
            href="/cotizar"
            className="inline-flex min-h-11 w-full items-center justify-center bg-gpar-orange px-6 text-sm font-bold text-gpar-ink transition-colors hover:bg-gpar-orange-ink"
            onClick={cerrarDrawer}
          >
            Solicitar cotización
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center border border-gpar-ink bg-gpar-bg px-6 text-sm font-semibold text-gpar-ink transition-colors hover:bg-gpar-ink hover:text-white"
            >
              Enviar por WhatsApp
            </a>
          ) : null}
        </div>
      </aside>
    </>
  );
}
