import { HTMLAttributes } from "react";
import { cn } from "@/utilidades/cn";

export function Contenedor({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("contenedor", className)} {...props} />;
}
