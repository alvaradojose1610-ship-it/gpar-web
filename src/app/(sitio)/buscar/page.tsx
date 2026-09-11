import type { Metadata } from "next";
import Link from "next/link";
import { TarjetaProducto } from "@/componentes/catalogo/TarjetaProducto";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import {
  obtenerBusqueda,
  obtenerCategoriasPorLinea,
} from "@/modulos/catalogo/catalogo-publico";

type Props = {
  searchParams?: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Buscar en el catálogo",
  description: "Busca repuestos por código, nombre o marca.",
};

export default async function PaginaBuscar({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const q = (params.q ?? "").trim();
  const [resultados, catsInd, catsAuto] = await Promise.all([
    q ? obtenerBusqueda(q) : Promise.resolve([]),
    obtenerCategoriasPorLinea("industrial"),
    obtenerCategoriasPorLinea("carga-pesada"),
  ]);
  const categorias = [...catsInd, ...catsAuto];

  return (
    <>
      <div className="border-b border-gpar-line bg-gpar-surface">
        <Contenedor className="flex flex-wrap gap-2.5 py-[11px] text-[13px] text-gpar-ink-2">
          <Link href="/" className="hover:text-gpar-ink">
            Inicio
          </Link>
          <span>/</span>
          <b className="text-gpar-ink">Búsqueda</b>
        </Contenedor>
      </div>

      <div className="border-b border-gpar-line">
        <Contenedor className="py-8">
          <p className="mb-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-gpar-orange-ink">
            Búsqueda en el catálogo
          </p>
          <h1 className="font-display text-[clamp(32px,4.4vw,46px)] font-extrabold uppercase leading-none text-gpar-ink">
            {q ? `Resultados para “${q}”` : "Buscar"}
          </h1>
          <p className="mt-3 text-[15.5px] text-gpar-ink-2">
            {q
              ? `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"}`
              : "Escribe un código, producto o marca en el buscador del encabezado."}
          </p>
        </Contenedor>
      </div>

      <section className="seccion">
        <Contenedor>
          {q && resultados.length === 0 ? (
            <div className="border border-dashed border-gpar-line bg-gpar-surface px-6 py-12 text-center">
              <p className="font-display text-2xl font-extrabold uppercase text-gpar-ink">
                Sin resultados
              </p>
              <p className="mt-2 text-gpar-ink-2">
                No encontramos coincidencias. Solicita el producto y te
                ayudamos a identificarlo.
              </p>
              <Link
                href="/cotizar"
                className="mt-5 inline-flex min-h-11 items-center justify-center bg-gpar-orange px-6 text-sm font-bold text-gpar-ink hover:bg-gpar-orange-ink"
              >
                Solicitar el producto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {resultados.map((producto) => {
                const cat = categorias.find(
                  (c) =>
                    c.id === producto.categoriaId && c.linea === producto.linea,
                );
                return (
                  <TarjetaProducto
                    key={producto.id}
                    producto={producto}
                    categoriaNombre={cat?.nombre}
                  />
                );
              })}
            </div>
          )}
        </Contenedor>
      </section>
    </>
  );
}
