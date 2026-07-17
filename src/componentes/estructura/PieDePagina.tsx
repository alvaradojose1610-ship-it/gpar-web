import Link from "next/link";
import { Logo } from "@/componentes/estructura/Logo";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { empresa } from "@/configuracion/empresa";
import { navegacionPrincipal } from "@/configuracion/navegacion";
import { categorias } from "@/datos/categorias";

export function PieDePagina() {
  const categoriasPrincipales = categorias.slice(0, 6);
  const anio = new Date().getFullYear();
  const dominio = empresa.urlSitio.replace(/^https?:\/\//, "");

  const datosConfirmados = [
    empresa.contacto.whatsapp,
    empresa.contacto.correo,
    empresa.contacto.telefono,
    empresa.contacto.direccion,
  ].filter((dato) => dato.disponible && dato.valor);

  return (
    <footer className="border-t border-industrial bg-oscuro text-blanco">
      <Contenedor className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-blanco/65">
            {empresa.eslogan}
          </p>
          <p className="text-xs text-blanco/45">{dominio}</p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-naranja">
            Navegación
          </h3>
          <ul className="space-y-2.5 text-sm text-blanco/70">
            {navegacionPrincipal.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="transition-colors hover:text-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-naranja">
            Categorías
          </h3>
          <ul className="space-y-2.5 text-sm text-blanco/70">
            {categoriasPrincipales.map((categoria) => (
              <li key={categoria.id}>
                <Link
                  href={categoria.href}
                  className="transition-colors hover:text-blanco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
                >
                  {categoria.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-naranja">
            Contacto
          </h3>
          {datosConfirmados.length > 0 ? (
            <ul className="space-y-2.5 text-sm text-blanco/70">
              {datosConfirmados.map((dato) => (
                <li key={dato.etiqueta}>
                  <span className="text-blanco/90">{dato.etiqueta}: </span>
                  {dato.href ? (
                    <a href={dato.href} className="hover:text-naranja">
                      {dato.valor}
                    </a>
                  ) : (
                    dato.valor
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-blanco/50">Datos de contacto próximamente.</p>
          )}
        </div>
      </Contenedor>

      <div className="border-t border-blanco/10">
        <Contenedor className="flex flex-col gap-2 py-4 text-xs text-blanco/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {empresa.nombreLegal}. Todos los derechos reservados.
          </p>
          <p>Sitio desarrollado por {empresa.desarrollador}</p>
        </Contenedor>
      </div>
    </footer>
  );
}
