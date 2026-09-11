import Link from "next/link";
import type { LineaCatalogo } from "@/datos/tipos-catalogo";
import { cn } from "@/utilidades/cn";

type ConmutadorLineaProps = {
  lineaActiva: LineaCatalogo;
  /** Si se pasa, usa query ?linea= en la home; si no, rutas /industrial|/carga-pesada */
  modo?: "ruta" | "query";
  baseHref?: string;
};

export function ConmutadorLinea({
  lineaActiva,
  modo = "ruta",
  baseHref = "/",
}: ConmutadorLineaProps) {
  const industrialHref =
    modo === "query"
      ? `${baseHref}?linea=industrial#catalogo`
      : "/industrial";
  const cargaPesadaHref =
    modo === "query"
      ? `${baseHref}?linea=carga-pesada#catalogo`
      : "/carga-pesada";

  return (
    <div
      role="tablist"
      aria-label="Línea de producto"
      className="mb-5 flex w-max border border-gpar-ink"
    >
      <Link
        href={industrialHref}
        role="tab"
        aria-selected={lineaActiva === "industrial"}
        aria-current={lineaActiva === "industrial" ? "true" : undefined}
        className={cn(
          "inline-flex min-h-11 items-center px-[18px] text-[13.5px] font-semibold text-gpar-ink",
          lineaActiva === "industrial" && "bg-gpar-ink text-white",
        )}
      >
        Repuestos industriales
      </Link>
      <Link
        href={cargaPesadaHref}
        role="tab"
        aria-selected={lineaActiva === "carga-pesada"}
        aria-current={lineaActiva === "carga-pesada" ? "true" : undefined}
        className={cn(
          "inline-flex min-h-11 items-center px-[18px] text-[13.5px] font-semibold text-gpar-ink",
          lineaActiva === "carga-pesada" && "bg-gpar-ink text-white",
        )}
      >
        Carga pesada
      </Link>
    </div>
  );
}
