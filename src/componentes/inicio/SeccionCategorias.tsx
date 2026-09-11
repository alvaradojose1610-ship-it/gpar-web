import { ConmutadorLinea } from "@/componentes/catalogo/ConmutadorLinea";
import { TarjetaCategoria } from "@/componentes/catalogo/TarjetaCategoria";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import type { CategoriaCatalogo, LineaCatalogo } from "@/datos/tipos-catalogo";

type SeccionCategoriasProps = {
  linea?: LineaCatalogo;
  modoConmutador?: "ruta" | "query";
  categorias: CategoriaCatalogo[];
  referencias: number;
  conteos: Record<string, number>;
};

export function SeccionCategorias({
  linea = "industrial",
  modoConmutador = "query",
  categorias,
  referencias,
  conteos,
}: SeccionCategoriasProps) {
  const etiquetaLinea =
    linea === "industrial" ? "Repuestos industriales" : "Carga pesada";

  return (
    <section id="catalogo" className="seccion scroll-mt-28">
      <Contenedor>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="font-display text-[clamp(28px,3.4vw,38px)] font-extrabold uppercase leading-[1.05] text-gpar-ink">
              Nuestras categorías
            </h2>
            <p className="mt-2 text-[15.5px] text-gpar-ink-2">
              Escoge una línea de producto: se abre su propia página con todo el
              detalle.
            </p>
          </div>
          <span className="font-mono text-[11.5px] text-gpar-ink-3">
            {referencias > 0 ? `${referencias}+ referencias` : etiquetaLinea} ·{" "}
            {categorias.length} categorías
          </span>
        </div>

        <ConmutadorLinea lineaActiva={linea} modo={modoConmutador} />

        {linea === "carga-pesada" && referencias === 0 ? (
          <p className="mb-[18px] text-[15.5px] text-gpar-ink-2">
            Línea en construcción. Escríbenos y te decimos qué tenemos disponible
            hoy.
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categorias.map((categoria) => (
            <TarjetaCategoria
              key={categoria.id}
              categoria={categoria}
              cantidadItems={conteos[categoria.id] ?? 0}
            />
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
