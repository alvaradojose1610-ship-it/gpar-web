import Link from "next/link";
import { LINEAS_CATALOGO, type LineaCatalogo } from "@/datos/lineas";
import { cn } from "@/utilidades/cn";

type ConmutadorLineaProps = {
  lineaActiva: LineaCatalogo;
  /** Si se pasa, usa query ?linea= en la home; si no, la ruta de cada línea. */
  modo?: "ruta" | "query";
  baseHref?: string;
};

export function ConmutadorLinea({
  lineaActiva,
  modo = "ruta",
  baseHref = "/",
}: ConmutadorLineaProps) {
  return (
    <div
      role="tablist"
      aria-label="Línea de producto"
      className="mb-5 flex w-full flex-col border border-gpar-ink sm:w-max sm:max-w-full sm:flex-row"
    >
      {LINEAS_CATALOGO.map((linea, indice) => {
        const href =
          modo === "query"
            ? `${baseHref}?linea=${linea.slug}#catalogo`
            : linea.href;
        const activa = lineaActiva === linea.slug;

        return (
          <Link
            key={linea.slug}
            href={href}
            role="tab"
            aria-selected={activa}
            aria-current={activa ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center justify-center px-4 text-center text-[13.5px] font-semibold text-gpar-ink sm:px-[18px]",
              indice > 0 && "border-t border-gpar-ink sm:border-l sm:border-t-0",
              activa && "bg-gpar-ink text-white",
            )}
          >
            {linea.etiqueta}
          </Link>
        );
      })}
    </div>
  );
}
