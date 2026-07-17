import { Handshake, Layers3, Rocket } from "lucide-react";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EncabezadoSeccion } from "@/componentes/interfaz/EncabezadoSeccion";

const puntos = [
  {
    icono: Handshake,
    titulo: "Atención cercana",
    descripcion: "Acompañamiento comercial para entender tu necesidad.",
  },
  {
    icono: Layers3,
    titulo: "Soluciones para diferentes necesidades",
    descripcion: "Productos orientados a operación, mantenimiento y producción.",
  },
  {
    icono: Rocket,
    titulo: "Portal preparado para crecer",
    descripcion:
      "Base lista para catálogo, cotizaciones y gestión de clientes.",
  },
] as const;

export function SeccionNosotros() {
  return (
    <section id="nosotros" className="seccion scroll-mt-24 bg-fondo">
      <Contenedor className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <EncabezadoSeccion
            className="mb-0"
            etiqueta="Nosotros"
            titulo="Un aliado para tus necesidades industriales"
            descripcion="Distribuidora GPar atiende requerimientos de productos y repuestos para operaciones comerciales e industriales. Nuestro portal facilitará la búsqueda de productos y la solicitud de cotizaciones desde cualquier dispositivo."
          />
        </div>

        <div className="grid gap-4">
          {puntos.map(({ icono: Icono, titulo, descripcion }) => (
            <article
              key={titulo}
              className="flex gap-4 rounded-2xl border border-claro bg-blanco p-5"
            >
              <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-fondo text-naranja">
                <Icono className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="mb-1 text-base font-semibold text-gris">
                  {titulo}
                </h3>
                <p className="text-sm leading-relaxed text-gris/70">
                  {descripcion}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
