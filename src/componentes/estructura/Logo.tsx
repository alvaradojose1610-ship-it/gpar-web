import Image from "next/image";
import Link from "next/link";
import { empresa } from "@/configuracion/empresa";
import { cn } from "@/utilidades/cn";

type LogoProps = {
  className?: string;
  prioridad?: boolean;
  conTexto?: boolean;
};

export function Logo({
  className,
  prioridad = false,
  conTexto = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-[11px]", className)}
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
      {conTexto ? (
        <span className="leading-none">
          <span className="block text-[11px] uppercase tracking-[0.08em] text-gpar-ink-2">
            Distribuidora
          </span>
          <span className="font-display text-[26px] font-extrabold tracking-[0.02em] text-gpar-orange">
            GPAR
          </span>
        </span>
      ) : null}
    </Link>
  );
}
