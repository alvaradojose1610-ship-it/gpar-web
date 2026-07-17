import { BarraSuperior } from "@/componentes/estructura/BarraSuperior";
import { Encabezado } from "@/componentes/estructura/Encabezado";
import { PieDePagina } from "@/componentes/estructura/PieDePagina";

export function EstructuraSitio({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraSuperior />
      <Encabezado />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <PieDePagina />
    </>
  );
}
