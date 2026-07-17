import { HeroInicio } from "@/componentes/inicio/HeroInicio";
import { SeccionAccesosRapidos } from "@/componentes/inicio/SeccionAccesosRapidos";
import { SeccionCategorias } from "@/componentes/inicio/SeccionCategorias";
import { SeccionAyudaProducto } from "@/componentes/inicio/SeccionAyudaProducto";
import { SeccionProductosDestacados } from "@/componentes/inicio/SeccionProductosDestacados";
import { SeccionMarcas } from "@/componentes/inicio/SeccionMarcas";
import { SeccionPropuestaValor } from "@/componentes/inicio/SeccionPropuestaValor";
import { SeccionCotizacion } from "@/componentes/inicio/SeccionCotizacion";
import { SeccionEmpresa } from "@/componentes/inicio/SeccionEmpresa";
import { SeccionContacto } from "@/componentes/inicio/SeccionContacto";

export default function PaginaInicio() {
  return (
    <>
      <HeroInicio />
      <SeccionAccesosRapidos />
      <SeccionCategorias />
      <SeccionAyudaProducto />
      <SeccionProductosDestacados />
      <SeccionMarcas />
      <SeccionPropuestaValor />
      <SeccionCotizacion />
      <SeccionEmpresa />
      <SeccionContacto />
    </>
  );
}
