import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EncabezadoSeccion } from "@/componentes/interfaz/EncabezadoSeccion";
import { categorias } from "@/datos/categorias";

export function SeccionCategorias() {
  return (
    <section id="categorias" className="seccion scroll-mt-24 bg-fondo">
      <Contenedor>
        <EncabezadoSeccion
          titulo="Categorías"
          descripcion="Selecciona una línea de producto para continuar."
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {categorias.map((categoria) => {
            const Icono = categoria.icono;

            return (
              <article
                key={categoria.id}
                className="group overflow-hidden rounded-md border border-borde bg-blanco"
              >
                <div className="relative aspect-[2/1] overflow-hidden bg-fondo">
                  {categoria.imagen ? (
                    <Image
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-fondo">
                      <div className="absolute inset-0 rejilla-industrial" />
                      <Icono
                        className="relative size-5 text-naranja"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 p-3">
                  <h3 className="text-sm font-semibold text-acero">
                    {categoria.nombre}
                  </h3>
                  <Link
                    href={categoria.href}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-naranja hover:text-naranja-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
                  >
                    Ver productos
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Contenedor>
    </section>
  );
}
