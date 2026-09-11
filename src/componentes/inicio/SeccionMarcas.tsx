import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { marcasTemporales } from "@/datos/marcas";

export function SeccionMarcas() {
  return (
    <section
      id="marcas"
      className="seccion scroll-mt-28 border-y border-gpar-line bg-gpar-surface"
    >
      <Contenedor className="text-center">
        <p className="mb-[22px] font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
          Trabajamos con marcas reconocidas del mercado
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {marcasTemporales.slice(0, 5).map((marca, i) => (
            <span
              key={marca.id}
              className="font-display text-[26px] font-bold tracking-[0.03em] text-gpar-ink-4"
            >
              Marca {i + 1}
            </span>
          ))}
        </div>
        <p className="mt-[18px] text-[15.5px] text-gpar-ink-2">
          PLACEHOLDER — GPar debe confirmar qué marcas se pueden exhibir.
        </p>
      </Contenedor>
    </section>
  );
}
