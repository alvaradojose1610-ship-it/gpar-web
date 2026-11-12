import type { Metadata } from "next";
import { SeccionCategorias } from "@/componentes/inicio/SeccionCategorias";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import {
  obtenerCategoriasPorLinea,
  obtenerConteosPorLinea,
  totalPorLinea,
} from "@/modulos/catalogo/catalogo-publico";

export const metadata: Metadata = {
  title: "Rodamientos industriales",
  description:
    "Catálogo de rodamientos industriales: rodamientos, correas, chumaceras, motores y más.",
};

export default async function PaginaIndustrial() {
  const linea = "industrial" as const;
  const [categorias, referencias, conteos] = await Promise.all([
    obtenerCategoriasPorLinea(linea),
    totalPorLinea(linea),
    obtenerConteosPorLinea(linea),
  ]);

  return (
    <>
      <div className="border-b border-gpar-line bg-gpar-surface">
        <Contenedor className="py-8">
          <p className="mb-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-gpar-orange-ink">
            Catálogo
          </p>
          <h1 className="font-display text-[clamp(32px,4.4vw,46px)] font-extrabold uppercase leading-none text-gpar-ink">
            Rodamientos industriales
          </h1>
          <p className="mt-3 max-w-[54ch] text-[15.5px] text-gpar-ink-2">
            Explora rodamientos, correas, chumaceras y el resto del surtido
            industrial, y agrega referencias a tu cotización.
          </p>
        </Contenedor>
      </div>
      <SeccionCategorias
        linea={linea}
        modoConmutador="ruta"
        categorias={categorias}
        referencias={referencias}
        conteos={conteos}
      />
    </>
  );
}
