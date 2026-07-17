import Link from "next/link";
import { FolderSearch, Hash, PackageSearch, Tags } from "lucide-react";
import { Contenedor } from "@/componentes/interfaz/Contenedor";

const accesos = [
  {
    icono: Hash,
    titulo: "Buscar por código",
    descripcion: "Localiza una referencia específica.",
    href: "/#productos",
  },
  {
    icono: FolderSearch,
    titulo: "Explorar categorías",
    descripcion: "Navega por líneas de producto.",
    href: "/#categorias",
  },
  {
    icono: PackageSearch,
    titulo: "Solicitar un producto",
    descripcion: "Pide ayuda para identificarlo.",
    href: "/#cotizacion",
  },
  {
    icono: Tags,
    titulo: "Consultar una marca",
    descripcion: "Revisa proveedores disponibles.",
    href: "/#marcas",
  },
] as const;

export function SeccionAccesosRapidos() {
  return (
    <section className="border-b border-borde bg-blanco py-10 sm:py-12">
      <Contenedor>
        <h2 className="mb-6 text-center text-lg font-bold text-acero sm:text-xl">
          ¿Cómo podemos ayudarte?
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {accesos.map(({ icono: Icono, titulo, descripcion, href }) => (
            <Link
              key={titulo}
              href={href}
              className="rounded-lg border border-borde bg-fondo px-4 py-4 transition-colors hover:border-naranja/40 hover:bg-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
            >
              <Icono className="mb-3 size-5 text-naranja" strokeWidth={1.75} aria-hidden />
              <p className="text-sm font-semibold text-acero">{titulo}</p>
              <p className="mt-1 text-xs leading-relaxed text-acero/60">
                {descripcion}
              </p>
            </Link>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
