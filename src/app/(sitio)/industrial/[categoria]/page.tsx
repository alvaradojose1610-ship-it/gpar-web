import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VistaCatalogoCategoria } from "@/componentes/catalogo/VistaCatalogoCategoria";
import {
  obtenerCategoria,
  obtenerProductosPorCategoria,
} from "@/modulos/catalogo/catalogo-publico";

type Props = {
  params: Promise<{ categoria: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: categoriaId } = await params;
  const categoria = await obtenerCategoria("industrial", categoriaId);
  if (!categoria) return { title: "Categoría" };
  return {
    title: categoria.nombre,
    description: categoria.descripcion,
  };
}

export default async function PaginaCategoriaIndustrial({ params }: Props) {
  const { categoria: categoriaId } = await params;
  const categoria = await obtenerCategoria("industrial", categoriaId);
  if (!categoria) notFound();

  const productos = await obtenerProductosPorCategoria(
    "industrial",
    categoria.id,
  );

  return (
    <VistaCatalogoCategoria
      linea="industrial"
      categoriaNombre={categoria.nombre}
      categoriaDescripcion={categoria.descripcion}
      subcategorias={categoria.subcategorias ?? []}
      productos={productos}
      publicada={categoria.publicada}
    />
  );
}
