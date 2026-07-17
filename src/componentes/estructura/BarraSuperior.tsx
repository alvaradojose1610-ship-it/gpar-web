import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { empresa } from "@/configuracion/empresa";

export function BarraSuperior() {
  return (
    <div className="border-b border-oscuro/30 bg-oscuro text-blanco">
      <Contenedor className="flex h-8 items-center justify-between gap-3 text-xs sm:h-9 sm:text-sm">
        <p className="truncate font-medium text-blanco/85">
          Portal comercial · {empresa.nombreLegal}
        </p>
        <p className="hidden shrink-0 text-blanco/55 sm:block">
          Cotizaciones y asesoría comercial
        </p>
      </Contenedor>
    </div>
  );
}
