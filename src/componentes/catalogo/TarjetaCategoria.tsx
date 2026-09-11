import Image from "next/image";
import Link from "next/link";
import type { CategoriaCatalogo } from "@/datos/tipos-catalogo";
import { imagenCategoria } from "@/datos/imagenes-categorias";
import { cn } from "@/utilidades/cn";

type TarjetaCategoriaProps = {
  categoria: CategoriaCatalogo;
  cantidadItems: number;
};

export function TarjetaCategoria({
  categoria,
  cantidadItems,
}: TarjetaCategoriaProps) {
  const href = `/${categoria.linea}/${categoria.id}`;
  const proximamente = !categoria.publicada;
  const foto = categoria.imagen ?? imagenCategoria(categoria.id);

  const media = (
    <div className="relative h-[150px] overflow-hidden border-b border-gpar-line-soft bg-gpar-surface">
      {foto ? (
        <Image
          src={foto}
          alt={categoria.nombre}
          fill
          className="object-cover"
          sizes="(max-width:480px) 100vw, (max-width:1024px) 50vw, 25vw"
        />
      ) : (
        <div className="placeholder-media flex h-full items-center justify-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
            {categoria.nombre}
          </span>
        </div>
      )}
    </div>
  );

  if (proximamente) {
    return (
      <div
        className="flex flex-col border border-gpar-line bg-gpar-bg opacity-55"
        aria-disabled="true"
      >
        {media}
        <div className="flex flex-1 flex-col gap-2 p-[15px]">
          <h3 className="font-display text-[21px] font-bold uppercase leading-[1.05] text-gpar-ink">
            {categoria.nombre}
          </h3>
          <p className="flex-1 text-[13.5px] text-gpar-ink-2">
            {categoria.descripcion}
          </p>
          <div className="mt-1 border-t border-gpar-line-soft pt-[11px]">
            <span className="font-mono text-[11.5px] text-gpar-ink-3">
              Próximamente
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col border border-gpar-line bg-gpar-bg text-inherit transition-[border-color] duration-[180ms] ease-[cubic-bezier(0.2,0.6,0.2,1)]",
        "hover:border-gpar-orange hover:text-inherit",
      )}
    >
      {media}
      <div className="flex flex-1 flex-col gap-2 p-[15px]">
        <h3 className="font-display text-[21px] font-bold uppercase leading-[1.05] text-gpar-ink">
          {categoria.nombre}
        </h3>
        <p className="flex-1 text-[13.5px] text-gpar-ink-2">
          {categoria.descripcion}
        </p>
        <div className="mt-1 flex items-center justify-between border-t border-gpar-line-soft pt-[11px]">
          <span className="font-mono text-[11.5px] text-gpar-ink-3">
            {cantidadItems} {cantidadItems === 1 ? "ítem" : "ítems"}
          </span>
          <span className="text-[13px] font-bold text-gpar-orange-ink">
            Ver productos →
          </span>
        </div>
      </div>
    </Link>
  );
}
