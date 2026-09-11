import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { empresa } from "@/configuracion/empresa";

/** Bloque de contacto compacto (WhatsApp / Instagram / Maps). */
export function SeccionContacto() {
  return (
    <section id="contacto" className="seccion scroll-mt-28">
      <Contenedor>
        <h2 className="font-display text-[clamp(28px,3.4vw,38px)] font-extrabold uppercase leading-[1.05] text-gpar-ink">
          Contacto
        </h2>
        <p className="mt-2 max-w-[50ch] text-[15.5px] text-gpar-ink-2">
          Escríbenos por WhatsApp, llámanos o mira la ubicación en Maps.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {empresa.contacto.whatsapp.disponible &&
          empresa.contacto.whatsapp.href ? (
            <li className="border border-gpar-line bg-gpar-surface p-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
                WhatsApp
              </span>
              <a
                href={empresa.contacto.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-[15px] font-semibold text-gpar-ink hover:text-gpar-orange-ink"
              >
                {empresa.contacto.whatsapp.valor}
              </a>
            </li>
          ) : null}
          {empresa.contacto.telefono.disponible &&
          empresa.contacto.telefono.href ? (
            <li className="border border-gpar-line bg-gpar-surface p-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
                Teléfono
              </span>
              <a
                href={empresa.contacto.telefono.href}
                className="mt-1 block text-[15px] font-semibold text-gpar-ink hover:text-gpar-orange-ink"
              >
                {empresa.contacto.telefono.valor}
              </a>
            </li>
          ) : null}
          {empresa.redes.instagram.disponible &&
          empresa.redes.instagram.href ? (
            <li className="border border-gpar-line bg-gpar-surface p-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
                Instagram
              </span>
              <a
                href={empresa.redes.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-[15px] font-semibold text-gpar-ink hover:text-gpar-orange-ink"
              >
                {empresa.redes.instagram.valor}
              </a>
            </li>
          ) : null}
          {empresa.contacto.direccion.disponible &&
          empresa.contacto.direccion.href ? (
            <li className="border border-gpar-line bg-gpar-surface p-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
                Ubicación
              </span>
              <a
                href={empresa.contacto.direccion.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-[15px] font-semibold text-gpar-ink hover:text-gpar-orange-ink"
              >
                Ver en Google Maps
              </a>
            </li>
          ) : null}
        </ul>
      </Contenedor>
    </section>
  );
}
