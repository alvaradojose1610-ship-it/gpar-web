import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utilidades/cn";

type Variante = "principal" | "secundario" | "contorno" | "fantasma";
type Tamano = "sm" | "md" | "lg";

const variantes: Record<Variante, string> = {
  principal:
    "bg-naranja text-blanco hover:bg-naranja-hover focus-visible:ring-naranja",
  secundario:
    "bg-oscuro text-blanco hover:bg-oscuro/90 focus-visible:ring-oscuro",
  contorno:
    "border border-borde bg-blanco text-acero hover:border-naranja hover:text-naranja focus-visible:ring-naranja",
  fantasma:
    "bg-transparent text-acero hover:bg-fondo focus-visible:ring-acero",
};

const tamanos: Record<Tamano, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export type BotonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  tamano?: Tamano;
};

export const Boton = forwardRef<HTMLButtonElement, BotonProps>(
  (
    {
      className,
      variante = "principal",
      tamano = "md",
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantes[variante],
        tamanos[tamano],
        className,
      )}
      {...props}
    />
  ),
);

Boton.displayName = "Boton";
