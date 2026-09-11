import { TarjetaProducto } from "@/componentes/catalogo/TarjetaProducto";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import type { ProductoCatalogo } from "@/datos/tipos-catalogo";

type Props = {
  productos: ProductoCatalogo[];
};

export function SeccionProductosDestacados({ productos }: Props) {
  if (productos.length === 0) return null;

  return (
    <section id="productos" className="seccion scroll-mt-28">
      <Contenedor>
        <h2 className="font-display text-[clamp(28px,3.4vw,38px)] font-extrabold uppercase leading-[1.05] text-gpar-ink">
          Productos destacados
        </h2>
        <p className="mb-6 mt-2 text-[15.5px] text-gpar-ink-2">
          Los más pedidos en mostrador. Agrégalos a tu cotización.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productos.map((producto) => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              compacta
            />
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
