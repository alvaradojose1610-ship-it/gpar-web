"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { DrawerCotizacion } from "@/componentes/cotizacion/DrawerCotizacion";
import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { empresa } from "@/configuracion/empresa";
import { cn } from "@/utilidades/cn";

const nav = [
  { etiqueta: "Inicio", href: "/" },
  { etiqueta: "Industrial", href: "/industrial" },
  { etiqueta: "Automotriz", href: "/automotriz" },
  { etiqueta: "Contacto", href: "/cotizar" },
] as const;

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
        <Contenedor className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 lg:grid-cols-[auto_minmax(220px,430px)_1fr_auto]">
          <Link
            href="/"
            className="flex items-center gap-[11px]"
            aria-label={empresa.nombreLegal}
          >
            <Image
              src="/assets/identidad/logo-gpar.png"
              alt={empresa.nombreLegal}
              width={46}
              height={46}
              priority
              className="size-[44px] rounded-full object-contain sm:size-[46px]"
            />
            <span className="leading-none">
              <span className="block text-[11px] uppercase tracking-[0.08em] text-gpar-ink-2">
                Distribuidora
              </span>
              <span className="font-display text-[26px] font-extrabold tracking-[0.02em] text-gpar-orange">
                GPAR
              </span>
            </span>
          </Link>

          <form
            role="search"
            action="/buscar"
            onSubmit={manejarBusqueda}
            className="col-span-full order-3 flex items-center gap-1.5 border border-gpar-line bg-gpar-surface px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2 lg:col-auto lg:order-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/iconos/buscar.svg" alt="" width={18} height={18} />
            <input
              type="search"
              name="q"
              placeholder="Código, producto o marca"
              aria-label="Buscar en el catálogo"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="min-h-9 shrink-0 bg-gpar-orange px-3 text-[12.5px] font-semibold text-gpar-ink hover:bg-gpar-orange-ink sm:px-3.5"
            >
              Buscar
            </button>
          </form>

          <nav
            className="hidden items-center gap-[18px] text-sm font-medium text-gpar-ink-2 md:flex"
            aria-label="Principal"
          >
            {nav.map((enlace) => {
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

          <div className="flex items-center gap-2 justify-self-end">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Mi cotización, ${totalUnidades} ítems`}
              className="flex min-h-11 items-center gap-1.5 border border-gpar-ink bg-gpar-bg px-2.5 text-[13px] font-semibold text-gpar-ink hover:bg-gpar-ink hover:text-white sm:gap-2 sm:px-3.5 sm:text-[13.5px]"
              onClick={abrirDrawer}
            >
              <span className="hidden sm:inline">Mi cotización</span>
              <span className="sm:hidden">Cotizar</span>{" "}
              <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center bg-gpar-orange px-1 font-mono text-xs text-gpar-ink">
                {totalUnidades}
              </span>
            </button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center border border-gpar-line bg-gpar-bg md:hidden"
              aria-expanded={menuAbierto}
              aria-controls="menu-movil"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuAbierto((v) => !v)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/iconos/menu.svg" alt="" width={22} height={22} />
            </button>
          </div>
        </Contenedor>

        <div
          id="menu-movil"
          className={cn(
            "border-t border-gpar-line bg-gpar-bg md:hidden",
            menuAbierto ? "block" : "hidden",
          )}
        >
          <Contenedor className="flex flex-col gap-0.5 py-2">
            {nav.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="px-1 py-2.5 text-[15px] font-semibold text-gpar-ink"
                onClick={() => setMenuAbierto(false)}
              >
                {enlace.etiqueta}
              </Link>
            ))}
          </Contenedor>
        </div>
      </header>
      <DrawerCotizacion />
    </>
  );
}
