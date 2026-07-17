import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EnlaceBoton } from "@/componentes/interfaz/EnlaceBoton";

export function SeccionAyudaProducto() {
  return (
    <section className="bg-blanco pb-4 pt-2">
      <Contenedor>
        <div className="flex flex-col gap-4 rounded-lg border border-borde bg-fondo px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-base font-bold text-acero sm:text-lg">
              ¿No conoces el código del producto?
            </h2>
            <p className="text-sm text-acero/65">
              Cuéntanos qué equipo utilizas o qué pieza necesitas. Te ayudamos a
              identificarlo.
            </p>
          </div>
          <EnlaceBoton href="/#contacto" tamano="sm" className="w-full sm:w-auto">
            Solicitar ayuda
          </EnlaceBoton>
        </div>
      </Contenedor>
    </section>
  );
}
