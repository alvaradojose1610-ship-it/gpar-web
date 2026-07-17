import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utilidades/cn";

type EncabezadoSeccionProps = HTMLAttributes<HTMLDivElement> & {
  etiqueta?: string;
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
};

export function EncabezadoSeccion({
  etiqueta,
  titulo,
  descripcion,
  accion,
  className,
  ...props
}: EncabezadoSeccionProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 md:mb-8",
        accion ? "md:flex-row md:items-end md:justify-between" : undefined,
        className,
      )}
      {...props}
    >
      <div className="max-w-2xl space-y-2">
        {etiqueta ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-naranja">
            {etiqueta}
          </p>
        ) : null}
        <h2 className="text-xl font-bold tracking-tight text-acero sm:text-2xl">
          {titulo}
        </h2>
        {descripcion ? (
          <p className="text-sm leading-relaxed text-acero/70">{descripcion}</p>
        ) : null}
      </div>
      {accion ? <div className="shrink-0">{accion}</div> : null}
    </div>
  );
}
