import { HeroInicio } from "@/componentes/inicio/HeroInicio";
import { SeccionAyudaProducto } from "@/componentes/inicio/SeccionAyudaProducto";
import { SeccionCategorias } from "@/componentes/inicio/SeccionCategorias";
import { SeccionBandaCta } from "@/componentes/inicio/SeccionBandaCta";
import { SeccionProductosDestacados } from "@/componentes/inicio/SeccionProductosDestacados";
import { SeccionMarcas } from "@/componentes/inicio/SeccionMarcas";
import { SeccionPropuestaValor } from "@/componentes/inicio/SeccionPropuestaValor";
import { SeccionCotizacion } from "@/componentes/inicio/SeccionCotizacion";
import { SeccionContacto } from "@/componentes/inicio/SeccionContacto";
import type { LineaCatalogo } from "@/datos/tipos-catalogo";
import {
  contarEnCategoria,
  obtenerCategoriasPorLinea,
  obtenerProductosDestacados,
  totalPorLinea,
} from "@/modulos/catalogo/catalogo-publico";

type PaginaInicioProps = {
  searchParams?: Promise<{ linea?: string }>;
};

function resolverLinea(valor?: string): LineaCatalogo {
  return valor === "carga-pesada" || valor === "automotriz"
    ? "carga-pesada"
    : "industrial";
}

export default async function PaginaInicio({ searchParams }: PaginaInicioProps) {
  const params = searchParams ? await searchParams : {};
  const linea = resolverLinea(params.linea);

  const [categorias, referencias, destacados] = await Promise.all([
    obtenerCategoriasPorLinea(linea),
    totalPorLinea(linea),
    obtenerProductosDestacados(8),
  ]);

  const conteosEntries = await Promise.all(
    categorias.map(async (c) => [c.id, await contarEnCategoria(linea, c.id)] as const),
  );
  const conteos = Object.fromEntries(conteosEntries);

  return (
    <>
      <HeroInicio />
      <SeccionAyudaProducto />
      <SeccionCategorias
        linea={linea}
        modoConmutador="query"
        categorias={categorias}
        referencias={referencias}
        conteos={conteos}
      />
      <SeccionBandaCta />
      <SeccionProductosDestacados productos={destacados} />
      <SeccionMarcas />
      <SeccionPropuestaValor />
      <SeccionCotizacion />
      <SeccionContacto />
    </>
  );
}
