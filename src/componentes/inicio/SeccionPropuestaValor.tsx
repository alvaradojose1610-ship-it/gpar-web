import { Layers3, Headphones, MessageSquareQuote, Rocket } from "lucide-react";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EncabezadoSeccion } from "@/componentes/interfaz/EncabezadoSeccion";

const puntos = [
  {
    icono: Layers3,
    titulo: "Variedad de categorías",
    descripcion: "Líneas para mantenimiento y operación industrial.",
  },
  {
    icono: Headphones,
    titulo: "Atención cercana",
    descripcion: "Canal comercial para acompañar tu solicitud.",
  },
  {
    icono: MessageSquareQuote,
    titulo: "Solicitudes de cotización",
    descripcion: "Espacio preparado para pedidos de información.",
  },
  {
    icono: Rocket,
    titulo: "Portal preparado para crecer",
    descripcion: "Base lista para catálogo y operación futura.",
  },
] as const;

export function SeccionPropuestaValor() {
  return (
    <section className="seccion bg-blanco">
      <Contenedor>
        <EncabezadoSeccion titulo="Atención comercial orientada a tu operación" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {puntos.map(({ icono: Icono, titulo, descripcion }) => (
            <article
              key={titulo}
              className="rounded-md border border-borde bg-fondo p-4"
            >
              <Icono className="mb-3 size-5 text-naranja" strokeWidth={1.75} aria-hidden />
              <h3 className="mb-1 text-sm font-semibold text-acero">{titulo}</h3>
              <p className="text-xs leading-relaxed text-acero/60">{descripcion}</p>
            </article>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
