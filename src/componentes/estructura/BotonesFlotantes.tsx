"use client";

import { useEffect, useState } from "react";
import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";
import { empresa } from "@/configuracion/empresa";

/**
 * Accesos flotantes: Instagram, Google Maps y WhatsApp.
 * Mismo patrón que Encajas: aparecen tras scrollY > 280.
 */
export function BotonesFlotantes() {
  const [visible, setVisible] = useState(false);
  const { totalUnidades } = useCotizacion();
  const conBarraCotizacion = totalUnidades > 0;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseBtn =
    "inline-flex h-12 w-12 items-center justify-center rounded-full bg-gpar-ink text-white shadow-[0_6px_16px_rgba(29,36,48,0.35)] transition-[filter] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gpar-orange";

  const instagram = empresa.redes.instagram;
  const maps = empresa.redes.maps;
  const whatsapp = empresa.contacto.whatsapp;

  return (
    <div
      className={`fixed z-[60] flex flex-col items-center gap-3 transition-opacity duration-200 ${
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      style={{
        right: "max(24px, env(safe-area-inset-right))",
        bottom: conBarraCotizacion
          ? "max(24px, calc(env(safe-area-inset-bottom) + 88px))"
          : "max(24px, calc(env(safe-area-inset-bottom) + 12px))",
      }}
      aria-label="Accesos rápidos"
    >
      {instagram.disponible && instagram.href ? (
        <a
          href={instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseBtn}
          aria-label="Ver Instagram de Distribuidora GPar"
          title="Instagram"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      ) : null}

      {maps.disponible && maps.href ? (
        <a
          href={maps.href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseBtn}
          aria-label="Ver ubicación en Google Maps"
          title="Google Maps"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </a>
      ) : null}

      {whatsapp.disponible && whatsapp.href ? (
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseBtn}
          aria-label="Escribir por WhatsApp"
          title="WhatsApp"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}
