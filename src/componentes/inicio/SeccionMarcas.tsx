import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EncabezadoSeccion } from "@/componentes/interfaz/EncabezadoSeccion";
import { marcasTemporales } from "@/datos/marcas";

export function SeccionMarcas() {
  return (
    <section id="marcas" className="seccion scroll-mt-24 bg-fondo">
      <Contenedor>
        <EncabezadoSeccion
          titulo="Marcas"
          descripcion="Las marcas se confirmarán durante la carga del catálogo."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {marcasTemporales.map((marca) => (
            <div
              key={marca.id}
              className="flex h-16 items-center justify-center rounded-md border border-borde bg-blanco px-3"
            >
              <span className="text-[11px] font-medium text-acero/40">
                {marca.nombre}
              </span>
            </div>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
