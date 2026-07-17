import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EnlaceBoton } from "@/componentes/interfaz/EnlaceBoton";

export function SeccionCotizacion() {
  return (
    <section id="cotizacion" className="seccion scroll-mt-24 bg-blanco">
      <Contenedor>
        <div className="rounded-xl border border-borde bg-fondo px-6 py-9 sm:px-10 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-acero sm:text-2xl">
              ¿No encontraste lo que buscas?
            </h2>
            <p className="text-sm text-acero/65">
              Envíanos tu solicitud y te ayudamos a identificar el producto.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row md:mt-0">
            <EnlaceBoton href="/#contacto" tamano="md">
              Solicitar cotización
            </EnlaceBoton>
            <EnlaceBoton href="/#categorias" variante="contorno" tamano="md">
              Ver categorías
            </EnlaceBoton>
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
