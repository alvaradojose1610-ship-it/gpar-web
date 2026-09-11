import { BarraSuperior } from "@/componentes/estructura/BarraSuperior";
import { Encabezado } from "@/componentes/estructura/Encabezado";
import { PieDePagina } from "@/componentes/estructura/PieDePagina";
import { BarraFlotanteCotizacion } from "@/componentes/cotizacion/BarraFlotanteCotizacion";

export function EstructuraSitio({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraSuperior />
      <Encabezado />
      <main className="flex-1 overflow-x-hidden pb-20">{children}</main>
      <PieDePagina />
      <BarraFlotanteCotizacion />
    </>
  );
}
