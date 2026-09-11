import Link from "next/link";
import { ComponentProps } from "react";
import { cn } from "@/utilidades/cn";

type Variante = "principal" | "secundario" | "contorno" | "fantasma";
type Tamano = "sm" | "md" | "lg";

const variantes: Record<Variante, string> = {
  principal: "bg-gpar-orange text-gpar-ink hover:bg-gpar-orange-ink",
  secundario:
    "border border-gpar-ink bg-gpar-bg text-gpar-ink hover:bg-gpar-ink hover:text-white",
  contorno:
    "border border-gpar-line bg-gpar-surface text-gpar-ink hover:border-gpar-orange",
  fantasma: "bg-transparent text-gpar-ink hover:bg-gpar-surface",
};

const tamanos: Record<Tamano, string> = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-11 px-6 text-base",
};

type EnlaceBotonProps = ComponentProps<typeof Link> & {
  variante?: Variante;
  tamano?: Tamano;
};

export function EnlaceBoton({
  className,
  variante = "principal",
  tamano = "md",
  ...props
}: EnlaceBotonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition-colors duration-[120ms]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gpar-ink",
        "active:translate-y-px",
        variantes[variante],
        tamanos[tamano],
        className,
      )}
      {...props}
    />
  );
}
