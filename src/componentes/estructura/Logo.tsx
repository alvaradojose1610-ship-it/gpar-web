import Image from "next/image";
import Link from "next/link";
import { empresa } from "@/configuracion/empresa";
import { cn } from "@/utilidades/cn";

type LogoProps = {
  className?: string;
  prioridad?: boolean;
};

/** Solo el isotipo circular; el nombre de marca vive en el hero. */
export function Logo({ className, prioridad = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label={empresa.nombreLegal}
    >
      <Image
        src="/assets/identidad/logo-gpar.png"
        alt={empresa.nombreLegal}
        width={46}
        height={46}
        priority={prioridad}
        className="size-11 rounded-full object-contain sm:size-[46px]"
      />
    </Link>
  );
}
