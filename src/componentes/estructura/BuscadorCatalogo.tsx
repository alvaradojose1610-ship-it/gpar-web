import { Search } from "lucide-react";

import { cn } from "@/utilidades/cn";

type BuscadorCatalogoProps = {
  className?: string;
  id?: string;
  variante?: "claro" | "hero";
  valorInicial?: string;
};

export function BuscadorCatalogo({
  className,
  id = "busqueda-catalogo",
  variante = "claro",
  valorInicial = "",
}: BuscadorCatalogoProps) {
  const esHero = variante === "hero";

  return (
    <form
      action="/buscar"
      method="get"
      className={cn("w-full", className)}
      role="search"
    >
      <label htmlFor={id} className="sr-only">
        Buscar por código, producto, marca o descripción
      </label>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-lg border shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-naranja/40",
          esHero
            ? "border-blanco/15 bg-blanco focus-within:border-naranja"
            : "border-borde bg-blanco focus-within:border-naranja",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5 sm:px-4">
          <Search
            className={cn(
              "size-4 shrink-0 sm:size-5",
              esHero ? "text-acero/45" : "text-acero/50",
            )}
            aria-hidden
          />
          <input
            id={id}
            name="q"
            type="search"
            defaultValue={valorInicial}
            placeholder="Buscar por código, producto, marca o descripción"
            className="w-full bg-transparent py-3.5 text-sm text-acero placeholder:text-acero/45 focus:outline-none sm:py-4 sm:text-[0.95rem]"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 bg-naranja px-4 text-sm font-semibold text-blanco transition-colors hover:bg-naranja-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja focus-visible:ring-offset-2 sm:px-6"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
