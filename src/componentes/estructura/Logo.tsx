import Image from "next/image";
import Link from "next/link";
import { empresa } from "@/configuracion/empresa";
import { cn } from "@/utilidades/cn";

type LogoProps = {
  className?: string;
  prioridad?: boolean;
};

export function Logo({ className, prioridad = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja focus-visible:ring-offset-2",
        className,
      )}
      aria-label={empresa.nombreLegal}
    >
      <Image
        src="/assets/identidad/logo-gpar.png"
        alt={empresa.nombreLegal}
        width={112}
        height={112}
        priority={prioridad}
        className="h-12 w-12 object-contain sm:h-14 sm:w-14"
      />
    </Link>
  );
}
