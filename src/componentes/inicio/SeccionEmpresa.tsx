import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { empresa } from "@/configuracion/empresa";

export function SeccionEmpresa() {
  return (
    <section id="empresa" className="border-y border-borde bg-blanco py-7">
      <Contenedor className="max-w-xl">
        <h2 className="mb-1.5 text-base font-bold text-acero">
          {empresa.nombreLegal}
        </h2>
        <p className="text-sm text-acero/65">
          Portal comercial para consultar productos industriales y solicitar
          cotizaciones.
        </p>
      </Contenedor>
    </section>
  );
}
