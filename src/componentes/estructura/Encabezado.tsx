"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/componentes/estructura/Logo";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EnlaceBoton } from "@/componentes/interfaz/EnlaceBoton";
import {
  navegacionAccion,
  navegacionPrincipal,
} from "@/configuracion/navegacion";
import { cn } from "@/utilidades/cn";

export function Encabezado() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-borde bg-blanco">
      <Contenedor className="flex h-16 items-center justify-between gap-3">
        <Logo prioridad />

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Navegación principal"
        >
          {navegacionPrincipal.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-acero/80 transition-colors hover:bg-fondo hover:text-acero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <EnlaceBoton href={navegacionAccion.href} tamano="sm">
            {navegacionAccion.etiqueta}
          </EnlaceBoton>

          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md border border-borde text-acero transition-colors hover:bg-fondo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja lg:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((valor) => !valor)}
          >
            {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Contenedor>

      <div
        id="menu-movil"
        className={cn(
          "border-t border-borde bg-blanco lg:hidden",
          abierto ? "block" : "hidden",
        )}
      >
        <Contenedor className="flex flex-col gap-1 py-3">
          {navegacionPrincipal.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="rounded-md px-3 py-3 text-base font-semibold text-acero hover:bg-fondo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
              onClick={() => setAbierto(false)}
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </Contenedor>
      </div>
    </header>
  );
}
