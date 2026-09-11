import type { Metadata } from "next";
import { SeccionCategorias } from "@/componentes/inicio/SeccionCategorias";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import {
  contarEnCategoria,
  obtenerCategoriasPorLinea,
  totalPorLinea,
} from "@/modulos/catalogo/catalogo-publico";

export const metadata: Metadata = {
  title: "Repuestos automotrices",
  description:
    "Catálogo de repuestos automotrices: rolineras, correas, retenes y más.",
};

export default async function PaginaAutomotriz() {
  const linea = "automotriz" as const;
  const [categorias, referencias] = await Promise.all([
    obtenerCategoriasPorLinea(linea),
    totalPorLinea(linea),
  ]);
  const conteosEntries = await Promise.all(
    categorias.map(async (c) => [c.id, await contarEnCategoria(linea, c.id)] as const),
  );
  const conteos = Object.fromEntries(conteosEntries);

  return (
    <>
      <div className="border-b border-gpar-line bg-gpar-surface">
        <Contenedor className="py-8">
          <p className="mb-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-gpar-orange-ink">
            Catálogo
          </p>
          <h1 className="font-display text-[clamp(32px,4.4vw,46px)] font-extrabold uppercase leading-none text-gpar-ink">
            Repuestos automotrices
          </h1>
          <p className="mt-3 max-w-[54ch] text-[15.5px] text-gpar-ink-2">
            Rolinera, correas y más para taller y público general.
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
