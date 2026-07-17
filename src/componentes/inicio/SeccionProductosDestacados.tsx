import Link from "next/link";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EncabezadoSeccion } from "@/componentes/interfaz/EncabezadoSeccion";
import { productosDestacados } from "@/datos/productos-destacados";

export function SeccionProductosDestacados() {
  return (
    <section id="productos" className="seccion scroll-mt-24 bg-blanco">
      <Contenedor>
        <EncabezadoSeccion titulo="Productos destacados" />
        <p className="mb-4 text-xs text-acero/55">
          Contenido demostrativo. El catálogo definitivo se incorporará
          próximamente.
        </p>

        <div className="overflow-x-auto rounded-md border border-borde">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-borde bg-fondo text-[11px] font-semibold uppercase tracking-wide text-acero/50">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Código</th>
                <th className="px-4 py-2.5 font-semibold">Producto</th>
                <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">
                  Categoría
                </th>
                <th className="px-4 py-2.5 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde bg-blanco">
              {productosDestacados.map((producto) => (
                <tr key={producto.id} className="hover:bg-fondo/70">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-acero/70">
                    {producto.codigo}
                  </td>
                  <td className="px-4 py-3 font-medium text-acero">
                    {producto.nombre}
                    <span className="mt-0.5 block text-xs font-normal text-acero/50 sm:hidden">
                      {producto.categoria}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-acero/65 sm:table-cell">
                    {producto.categoria}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href="/#cotizacion"
                      className="text-xs font-semibold text-naranja hover:text-naranja-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
                    >
                      Consultar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Contenedor>
    </section>
  );
}
