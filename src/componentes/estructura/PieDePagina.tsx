import Image from "next/image";
import Link from "next/link";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { empresa } from "@/configuracion/empresa";
import { categoriasPorLinea } from "@/datos/catalogo";

export function PieDePagina() {
  const anio = new Date().getFullYear();
  const dominio = empresa.urlSitio.replace(/^https?:\/\//, "");
  const categorias = categoriasPorLinea("industrial").slice(0, 6);

  return (
    <footer className="bg-gpar-ink pb-5 pt-10 text-gpar-ink-4">
      <Contenedor>
        <div className="flex flex-wrap justify-between gap-[34px] border-b border-white/10 pb-6">
          <div className="max-w-[30ch]">
            <div className="mb-3 flex items-center gap-2.5">
              <Image
                src="/assets/identidad/logo-gpar.png"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full bg-white object-contain"
              />
              <b className="font-display text-[22px] font-extrabold uppercase text-white">
                GPAR
              </b>
            </div>
            <p className="text-[13.5px]">
              Repuestos industriales y automotrices. Catálogo en línea, asesoría
              técnica y cotización por WhatsApp.
            </p>
          </div>

          <div>
            <h5 className="mb-3 text-xs uppercase tracking-[0.08em] text-white">
              Navegación
            </h5>
            <ul className="flex flex-col gap-2 text-[13.5px]">
              <li>
                <Link href="/industrial" className="hover:text-white">
                  Industrial
                </Link>
              </li>
              <li>
                <Link href="/carga-pesada" className="hover:text-white">
                  Carga Pesada
                </Link>
              </li>
              <li>
                <Link href="/#marcas" className="hover:text-white">
                  Marcas
                </Link>
              </li>
              <li>
                <Link href="/cotizar" className="hover:text-white">
                  Cotizar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-3 text-xs uppercase tracking-[0.08em] text-white">
              Categorías
            </h5>
            <ul className="flex flex-col gap-2 text-[13.5px]">
              {categorias.map((categoria) => (
                <li key={categoria.id}>
                  <Link
                    href={`/industrial/${categoria.id}`}
                    className="hover:text-white"
                  >
                    {categoria.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-3 text-xs uppercase tracking-[0.08em] text-white">
              Contacto
            </h5>
            <ul className="flex flex-col gap-2 text-[13.5px]">
              {empresa.contacto.whatsapp.disponible ? (
                <li>
                  WhatsApp:{" "}
                  <a
                    href={empresa.contacto.whatsapp.href ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {empresa.contacto.whatsapp.valor}
                  </a>
                </li>
              ) : null}
              {empresa.redes.instagram.disponible ? (
                <li>
                  Instagram:{" "}
                  <a
                    href={empresa.redes.instagram.href ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {empresa.redes.instagram.valor}
                  </a>
                </li>
              ) : null}
              {empresa.contacto.direccion.disponible ? (
                <li>
                  Ubicación:{" "}
                  <a
                    href={empresa.contacto.direccion.href ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {empresa.contacto.direccion.valor}
                  </a>
                </li>
              ) : null}
              {empresa.contacto.telefono.disponible ? (
                <li>
                  Teléfono:{" "}
                  <a
                    href={empresa.contacto.telefono.href ?? undefined}
                    className="hover:text-white"
                  >
                    {empresa.contacto.telefono.valor}
                  </a>
                </li>
              ) : (
                <li>Teléfono: por confirmar</li>
              )}
              {!empresa.contacto.correo.disponible ? (
                <li>Correo: por confirmar</li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-4 text-[12.5px]">
          <span>
            © {anio} {empresa.nombreLegal}. Todos los derechos reservados.
          </span>
          <span>{dominio}</span>
        </div>
      </Contenedor>
    </footer>
  );
}
