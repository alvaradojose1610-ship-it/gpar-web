"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { ItemNavegacionPanel } from "@/configuracion/navegacion-panel";
import { accionCerrarSesion } from "@/modulos/autenticacion/acciones";

type Props = {
  nombreUsuario: string;
  itemsNav: ItemNavegacionPanel[];
  children: React.ReactNode;
};

function enlaceActivo(pathname: string, href: string, exacto?: boolean) {
  if (exacto) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ShellPanel({ nombreUsuario, itemsNav, children }: Props) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="flex min-h-full bg-[#F7F8FA] text-[#1D2430]">
      {abierto ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setAbierto(false)}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#E4E7EC] bg-white transition-transform lg:static lg:translate-x-0",
          abierto ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="border-b border-[#E4E7EC] px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F57C00]">
            GPar
          </p>
          <p className="mt-1 text-sm font-semibold text-[#1D2430]">
            Panel interno
          </p>
          <p className="mt-1 truncate text-xs text-[#5C6675]">{nombreUsuario}</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Panel">
          <ul className="space-y-1">
            {itemsNav.map((item) => {
              const activo = enlaceActivo(
                pathname,
                item.href,
                item.exacto ?? false,
              );
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    className={[
                      "block px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D96A00]",
                      activo
                        ? "bg-[#FFF3E6] font-semibold text-[#D96A00]"
                        : "text-[#1D2430] hover:bg-[#F7F8FA]",
                    ].join(" ")}
                  >
                    {item.etiqueta}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#E4E7EC] p-3">
          <form action={accionCerrarSesion}>
            <button
              type="submit"
              className="w-full border border-[#E4E7EC] bg-white px-3 py-2 text-left text-sm font-medium text-[#1D2430] outline-none hover:bg-[#F7F8FA] focus-visible:ring-2 focus-visible:ring-[#D96A00]"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#E4E7EC] bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            className="border border-[#E4E7EC] px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#D96A00]"
            aria-expanded={abierto}
            aria-controls="nav-panel"
            onClick={() => setAbierto((v) => !v)}
          >
            Menú
          </button>
          <span className="text-sm font-semibold text-[#F57C00]">GPar</span>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
