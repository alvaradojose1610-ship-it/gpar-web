import Link from "next/link";
import { Contenedor } from "@/componentes/interfaz/Contenedor";

export function SeccionBandaCta() {
  return (
    <section className="bg-gpar-orange">
      <Contenedor className="flex flex-wrap items-center justify-between gap-6 py-10">
        <div>
          <h2 className="max-w-[26ch] font-display text-[clamp(24px,3.2vw,34px)] font-extrabold uppercase text-gpar-ink">
            ¿No sabes el código del repuesto?
          </h2>
          <p className="mt-2 max-w-[54ch] text-[15.5px] text-gpar-ink">
            Cuéntanos qué equipo tienes o qué pieza necesitas y la identificamos
            contigo.
          </p>
        </div>
        <Link
          href="/cotizar"
          className="inline-flex min-h-11 items-center justify-center bg-white px-6 text-sm font-bold text-gpar-ink hover:bg-gpar-surface"
        >
          Pedir asesoría
        </Link>
      </Contenedor>
    </section>
  );
}
