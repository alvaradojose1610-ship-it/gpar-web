import { Contenedor } from "@/componentes/interfaz/Contenedor";

export function BarraSuperior() {
  return (
    <div className="hidden bg-gpar-orange text-gpar-ink md:block">
      <Contenedor className="flex items-center justify-between gap-4 py-2 text-[12.5px]">
        <span>Soluciones para la industria</span>
        <span>Pedidos y cotizaciones por WhatsApp</span>
      </Contenedor>
    </div>
  );
}
