"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EnlaceBoton } from "@/componentes/interfaz/EnlaceBoton";

const chips = [
  { etiqueta: "Rodamientos", href: "/#categorias" },
  { etiqueta: "Correas", href: "/#categorias" },
  { etiqueta: "Motores", href: "/#categorias" },
  { etiqueta: "Lubricantes", href: "/#categorias" },
  { etiqueta: "Tornillería", href: "/#categorias" },
] as const;

export function HeroInicio() {
  const [mensaje, setMensaje] = useState<string | null>(null);

  function manejarBusqueda(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje("El catálogo completo estará disponible próximamente.");
  }

  return (
    <section className="relative isolate min-h-[520px] overflow-hidden sm:min-h-[560px] lg:min-h-[620px]">
      <Image
        src="/assets/hero/hero-principal.webp"
        alt="Trabajo industrial en taller"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-acero/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-acero/40 via-acero/50 to-acero/75" />

      <Contenedor className="relative flex min-h-[520px] items-center py-14 sm:min-h-[560px] lg:min-h-[620px]">
        <div className="mx-auto w-full max-w-3xl space-y-6 text-center sm:space-y-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-naranja">
            Suministros industriales
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-blanco sm:text-4xl lg:text-[2.75rem]">
            ¿Qué producto estás buscando?
          </h1>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-blanco/80 sm:text-base">
            Encuentra rápidamente repuestos, componentes y suministros
            industriales.
          </p>

          <form
            onSubmit={manejarBusqueda}
            role="search"
            className="mx-auto w-full max-w-2xl"
          >
            <label htmlFor="busqueda-portal" className="sr-only">
              Buscar por código, producto o marca
            </label>
            <div className="flex overflow-hidden rounded-xl border border-blanco/20 bg-blanco shadow-[0_18px_50px_rgba(0,0,0,0.28)] focus-within:ring-2 focus-within:ring-naranja">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                <Search className="size-5 shrink-0 text-acero/40" aria-hidden />
                <input
                  id="busqueda-portal"
                  name="busqueda"
                  type="search"
                  placeholder="Buscar por código, producto o marca"
                  className="w-full bg-transparent py-4 text-sm text-acero placeholder:text-acero/45 focus:outline-none sm:text-base"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 bg-naranja px-5 text-sm font-semibold text-blanco transition-colors hover:bg-naranja-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja focus-visible:ring-offset-2 sm:px-7"
              >
                Buscar
              </button>
            </div>
            {mensaje ? (
              <p role="status" className="mt-3 text-sm text-blanco/75">
                {mensaje}
              </p>
            ) : null}
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {chips.map((chip) => (
              <Link
                key={chip.etiqueta}
                href={chip.href}
                className="rounded-full border border-blanco/25 bg-blanco/10 px-3.5 py-1.5 text-xs font-semibold text-blanco backdrop-blur-sm transition-colors hover:border-naranja hover:bg-blanco/15 hover:text-naranja focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
              >
                {chip.etiqueta}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-2.5 pt-1 sm:flex-row">
            <EnlaceBoton href="/#categorias" tamano="md">
              Explorar categorías
            </EnlaceBoton>
            <EnlaceBoton
              href="/#cotizacion"
              variante="contorno"
              tamano="md"
              className="border-blanco/35 bg-transparent text-blanco hover:border-naranja hover:bg-transparent hover:text-naranja"
            >
              Solicitar cotización
            </EnlaceBoton>
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
