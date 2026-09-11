import Link from "next/link";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { categoriasPorLinea } from "@/datos/catalogo";

const chips = [
  { etiqueta: "Rodamientos", href: "/industrial/rodamientos" },
  { etiqueta: "Chumaceras", href: "/industrial/chumaceras" },
  { etiqueta: "Correas", href: "/industrial/correas" },
  { etiqueta: "Motores", href: "/industrial/motores-reductores" },
  { etiqueta: "Mangueras", href: "/industrial/mangueras-industriales" },
] as const;

export function HeroInicio() {
  const nombresStrip = categoriasPorLinea("industrial").map((c) => c.nombre);
  const stripDuplicado = [...nombresStrip, ...nombresStrip];

  return (
    <section className="relative border-b border-gpar-line bg-gpar-surface">
      <div className="placeholder-media absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.88)_60%,rgba(255,255,255,0.72)_100%)] md:inset-[0_0_46px_0] md:bg-[linear-gradient(100deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.93)_46%,rgba(255,255,255,0.62)_72%,rgba(255,255,255,0.30)_100%)]"
        aria-hidden
      />

      <Contenedor className="relative py-11 md:pb-[68px] md:pt-[76px]">
        <div className="max-w-[640px]">
          <span className="mb-5 inline-block border border-gpar-orange-border bg-gpar-orange-soft px-[11px] py-1.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-gpar-orange-ink">
            Industrial y automotriz
          </span>
          <h1 className="font-display text-[clamp(34px,5.4vw,62px)] font-extrabold uppercase leading-[0.97] tracking-[0.02em] text-gpar-ink">
            Todo para tu
            <br />
            planta y tu taller,
            <br />
            <em className="not-italic text-gpar-orange">en un solo lugar</em>
          </h1>
          <p className="mt-4 max-w-[50ch] text-[17px] text-gpar-ink-2">
            Rodamientos, correas, chumaceras, motores, mangueras y repuestos
            automotrices. Arma tu lista y te cotizamos con precio, disponibilidad
            y tiempo de entrega.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/cotizar"
              className="inline-flex min-h-11 items-center justify-center bg-gpar-orange px-6 text-sm font-bold text-gpar-ink hover:bg-gpar-orange-ink"
            >
              Solicitar cotización
            </Link>
            <Link
              href="#catalogo"
              className="inline-flex min-h-11 items-center justify-center border border-gpar-ink bg-gpar-bg px-6 text-sm font-semibold text-gpar-ink hover:bg-gpar-ink hover:text-white"
            >
              Ver el catálogo
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Link
                key={chip.etiqueta}
                href={chip.href}
                className="inline-flex min-h-9 items-center border border-gpar-line bg-gpar-bg px-[13px] py-[7px] text-[12.5px] font-semibold text-gpar-ink hover:border-gpar-orange"
              >
                {chip.etiqueta}
              </Link>
            ))}
          </div>
        </div>
      </Contenedor>

      <div
        className="relative overflow-hidden whitespace-nowrap border-t border-gpar-line bg-gpar-bg py-[11px]"
        aria-hidden="true"
      >
        <div
          data-strip
          className="inline-flex gap-6 font-display text-[15px] font-bold uppercase tracking-[0.05em] text-gpar-ink-4"
          style={{ animation: "gp-strip 42s linear infinite" }}
        >
          {stripDuplicado.map((nombre, i) => (
            <span key={`${nombre}-${i}`} className="inline-flex items-center gap-6">
              <span>{nombre}</span>
              <i className="not-italic text-gpar-orange">/</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
