"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
  mensaje: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">;

/** Submit con confirmación nativa (anular venta/compra, etc.). */
export function BotonConfirmar({
  mensaje,
  children,
  className,
  ...rest
}: Props) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(mensaje)) e.preventDefault();
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
