"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { DrawerCotizacion } from "@/componentes/cotizacion/DrawerCotizacion";
import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";
import { Logo } from "@/componentes/estructura/Logo";
import { navegacionPrincipal } from "@/configuracion/navegacion";
import { cn } from "@/utilidades/cn";

export function Encabezado() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalUnidades, abrirDrawer } = useCotizacion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const medir = () => {
      document.documentElement.style.setProperty(
        "--gp-header-h",
        `${Math.ceil(el.getBoundingClientRect().height)}px`,
      );
    };

    const observer = new ResizeObserver(medir);
    observer.observe(el);
    medir();
    return () => observer.disconnect();
  }, [menuAbierto]);

  function manejarBusqueda(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const data = new FormData(form);
    const q = String(data.get("q") ?? "").trim();
    if (!q) {
      router.push("/buscar");
      return;
    }
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
    setMenuAbierto(false);
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[60] border-b border-gpar-line bg-gpar-bg"
      >
        <div className="h-1 bg-[#A3245E]" aria-hidden />

        <div className="mx-auto grid max-w-[1680px] grid-cols-[auto_1fr_auto] items-center gap-x-[clamp(14px,1.6vw,28px)] gap-y-3 px-[clamp(20px,2.4vw,40px)] py-[clamp(14px,1.3vw,22px)] lg:grid-cols-[auto_minmax(170px,1fr)_auto_auto]">
          <Logo prioridad className="shrink-0" />

          <form
            role="search"
            action="/buscar"
            onSubmit={manejarBusqueda}
            className="col-span-full order-3 flex min-w-[170px] flex-[1_1_420px] items-center gap-[clamp(8px,0.8vw,14px)] border border-gpar-line bg-gpar-surface py-[clamp(6px,0.55vw,10px)] pl-[clamp(12px,1.2vw,22px)] pr-[clamp(6px,0.55vw,10px)] lg:col-auto lg:order-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/iconos/buscar.svg" alt="" width={22} height={22} />
            <input
              type="search"
              name="q"
              placeholder="Código, producto o marca"
              aria-label="Buscar en el catálogo"
              className="min-w-0 flex-1 border-0 bg-transparent text-[length:clamp(14px,1.05vw,20px)] text-gpar-ink outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="min-h-9 shrink-0 bg-gpar-orange px-[clamp(14px,1.5vw,28px)] py-[clamp(9px,0.8vw,15px)] text-[length:clamp(14px,1vw,19px)] font-bold text-gpar-ink hover:bg-gpar-orange-ink"
            >
              Buscar
            </button>
          </form>

          <nav
            className="hidden shrink-0 items-center gap-[clamp(12px,1.4vw,28px)] whitespace-nowrap text-[length:clamp(14.5px,1.05vw,20px)] font-medium text-gpar-ink-2 lg:flex"
            aria-label="Principal"
          >
            {navegacionPrincipal.map((enlace) => {
              const activo =
                enlace.href === "/"
                  ? pathname === "/"
                  : pathname === enlace.href ||
                    pathname.startsWith(`${enlace.href}/`);
              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "hover:text-gpar-ink",
                    activo && "text-gpar-ink",
                  )}
                >
                  {enlace.etiqueta}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 justify-self-end">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Mi cotización, ${totalUnidades} ítems`}
              className="flex min-h-11 items-center gap-[clamp(9px,0.85vw,16px)] border border-gpar-ink bg-gpar-bg px-[clamp(14px,1.4vw,26px)] py-[clamp(11px,1.05vw,20px)] text-[length:clamp(14px,1.05vw,20px)] font-semibold whitespace-nowrap text-gpar-ink hover:bg-gpar-ink hover:text-white"
              onClick={abrirDrawer}
            >
              <span className="hidden sm:inline">Mi cotización</span>
              <span className="sm:hidden">Cotizar</span>
              <span className="inline-flex h-[clamp(24px,1.9vw,36px)] min-w-[clamp(24px,1.9vw,36px)] items-center justify-center bg-gpar-orange px-1.5 font-mono text-[length:clamp(13px,0.95vw,18px)] font-semibold text-gpar-ink">
                {totalUnidades}
              </span>
            </button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center border border-gpar-line bg-gpar-bg lg:hidden"
              aria-expanded={menuAbierto}
              aria-controls="menu-movil"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuAbierto((v) => !v)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/iconos/menu.svg" alt="" width={22} height={22} />
            </button>
          </div>
        </div>

        <div
          id="menu-movil"
          className={cn(
            "border-t border-gpar-line bg-gpar-bg lg:hidden",
            menuAbierto ? "block" : "hidden",
          )}
        >
          <div className="mx-auto flex max-w-[1680px] flex-col gap-0.5 px-[clamp(20px,2.4vw,40px)] py-2">
            {navegacionPrincipal.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="px-1 py-2.5 text-[15px] font-semibold text-gpar-ink"
                onClick={() => setMenuAbierto(false)}
              >
                {enlace.etiqueta}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <DrawerCotizacion />
    </>
  );
}
