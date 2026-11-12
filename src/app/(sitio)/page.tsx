import { HeroInicio } from "@/componentes/inicio/HeroInicio";
import { SeccionAyudaProducto } from "@/componentes/inicio/SeccionAyudaProducto";
import { SeccionCategorias } from "@/componentes/inicio/SeccionCategorias";
import { SeccionBandaCta } from "@/componentes/inicio/SeccionBandaCta";
import { SeccionProductosDestacados } from "@/componentes/inicio/SeccionProductosDestacados";
import { SeccionMarcas } from "@/componentes/inicio/SeccionMarcas";
import { SeccionPropuestaValor } from "@/componentes/inicio/SeccionPropuestaValor";
import { SeccionCotizacion } from "@/componentes/inicio/SeccionCotizacion";
import { SeccionContacto } from "@/componentes/inicio/SeccionContacto";
import { lineaPorSlug, type LineaCatalogo } from "@/datos/lineas";
import {
  obtenerCategoriasPorLinea,
  obtenerConteosPorLinea,
  obtenerProductosDestacados,
  totalPorLinea,
} from "@/modulos/catalogo/catalogo-publico";
import { obtenerContenidoHero } from "@/modulos/configuracion/servicio-empresa";

type PaginaInicioProps = {
  searchParams?: Promise<{ linea?: string }>;
};

function resolverLinea(valor?: string): LineaCatalogo {
  if (valor === "carga-pesada" || valor === "automotriz") return "carga-pesada";
  return lineaPorSlug(valor)?.slug ?? "industrial";
}

export default async function PaginaInicio({ searchParams }: PaginaInicioProps) {
  const params = searchParams ? await searchParams : {};
  const linea = resolverLinea(params.linea);

  const [categorias, referencias, destacados, hero, conteos] = await Promise.all([
    obtenerCategoriasPorLinea(linea),
    totalPorLinea(linea),
    obtenerProductosDestacados(8),
    obtenerContenidoHero(),
    obtenerConteosPorLinea(linea),
  ]);

  return (
    <>
      <HeroInicio titulo={hero.tituloHero} subtitulo={hero.subtituloHero} />
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
