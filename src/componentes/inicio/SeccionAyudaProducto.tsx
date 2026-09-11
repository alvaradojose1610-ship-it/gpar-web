import Link from "next/link";
import { Contenedor } from "@/componentes/interfaz/Contenedor";

const ayudas = [
  {
    titulo: "Buscar por código",
    desc: "Ubica una referencia específica al instante.",
    href: "/buscar",
  },
  {
    titulo: "Explorar categorías",
    desc: "Navega por línea de producto.",
    href: "#catalogo",
  },
  {
    titulo: "Armar tu lista",
    desc: "Selecciona lo que necesitas.",
    href: "/industrial",
  },
  {
    titulo: "Pedir cotización",
    desc: "Precio, disponibilidad y entrega.",
    href: "/cotizar",
  },
] as const;

export function SeccionAyudaProducto() {
  return (
    <section className="seccion border-b border-gpar-line">
      <Contenedor>
        <h2 className="mb-[18px] font-display text-[26px] font-extrabold uppercase text-gpar-ink">
          ¿Cómo podemos ayudarte?
        </h2>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {ayudas.map((ayuda) => (
            <Link
              key={ayuda.titulo}
              href={ayuda.href}
              className="block border border-gpar-line border-t-[3px] border-t-gpar-orange bg-gpar-surface p-5 text-inherit transition-[border-color] duration-[180ms] hover:border-gpar-orange hover:text-inherit"
            >
              <b className="mb-1.5 block text-[15.5px] text-gpar-ink">
                {ayuda.titulo}
              </b>
              <span className="text-sm text-gpar-ink-2">{ayuda.desc}</span>
            </Link>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
