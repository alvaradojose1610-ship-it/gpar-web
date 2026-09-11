"use client";

import { FormEvent, useState, useTransition } from "react";
import { useCotizacion } from "@/componentes/cotizacion/ProveedorCotizacion";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { empresa } from "@/configuracion/empresa";
import { accionCrearCotizacionWeb } from "@/modulos/cotizaciones/acciones";

export function SeccionCotizacion() {
  const { items, totalUnidades, mensajeWhatsApp, abrirDrawer } = useCotizacion();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje(null);
    setError(null);

    const form = evento.currentTarget;
    const datos = new FormData(form);

    startTransition(async () => {
      const resultado = await accionCrearCotizacionWeb({
        nombre: String(datos.get("nombre") ?? ""),
        contacto: String(datos.get("contacto") ?? ""),
        empresa: String(datos.get("empresa") ?? ""),
        detalle: String(datos.get("detalle") ?? ""),
        items: items.map((item) => ({
          codigo: item.codigo,
          cantidad: item.cantidad,
        })),
      });

      if (!resultado.ok) {
        setError(resultado.error);
        return;
      }

      setMensaje(
        `Solicitud ${resultado.numero} registrada. Te contactaremos pronto. También puedes escribirnos por WhatsApp.`,
      );
      form.reset();
    });
  }

  const whatsappHref = empresa.contacto.whatsapp.href
    ? `${empresa.contacto.whatsapp.href}?text=${encodeURIComponent(mensajeWhatsApp)}`
    : null;

  return (
    <section
      id="cotizar"
      className="seccion scroll-mt-28 border-y border-gpar-line bg-gpar-surface"
    >
      <Contenedor className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-11">
        <div>
          <h2 className="font-display text-[clamp(28px,3.4vw,38px)] font-extrabold uppercase leading-[1.05] text-gpar-ink">
            Solicita tu cotización
          </h2>
          <p className="mt-2 max-w-[48ch] text-base text-gpar-ink-2">
            Cuéntanos qué equipo tienes parado y te decimos qué necesitas,
            aunque no tengas el código exacto.
          </p>
          <ul className="mt-6 flex flex-col gap-3.5">
            <li className="flex flex-col gap-0.5 border-b border-gpar-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
                WhatsApp
              </span>
              {empresa.contacto.whatsapp.disponible &&
              empresa.contacto.whatsapp.href ? (
                <a
                  href={empresa.contacto.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15.5px] text-gpar-ink hover:text-gpar-orange-ink"
                >
                  {empresa.contacto.whatsapp.valor}
                </a>
              ) : (
                <span className="text-[15.5px] text-gpar-ink">Por confirmar</span>
              )}
            </li>
            <li className="flex flex-col gap-0.5 border-b border-gpar-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
                Instagram
              </span>
              {empresa.redes.instagram.disponible &&
              empresa.redes.instagram.href ? (
                <a
                  href={empresa.redes.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15.5px] text-gpar-ink hover:text-gpar-orange-ink"
                >
                  {empresa.redes.instagram.valor}
                </a>
              ) : (
                <span className="text-[15.5px] text-gpar-ink">Por confirmar</span>
              )}
            </li>
            <li className="flex flex-col gap-0.5 border-b border-gpar-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gpar-ink-3">
                Ubicación
              </span>
              {empresa.contacto.direccion.disponible &&
              empresa.contacto.direccion.href ? (
                <a
                  href={empresa.contacto.direccion.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15.5px] text-gpar-ink hover:text-gpar-orange-ink"
                >
                  {empresa.contacto.direccion.valor}
                </a>
              ) : (
                <span className="text-[15.5px] text-gpar-ink">Por confirmar</span>
              )}
            </li>
          </ul>
        </div>

        <form
          onSubmit={manejarEnvio}
          className="flex flex-col gap-[13px] border border-gpar-line bg-gpar-bg p-6"
          noValidate
        >
          <h3 className="font-display text-[23px] font-extrabold uppercase text-gpar-ink">
            Formulario de cotización
          </h3>
          <input
            name="nombre"
            required
            placeholder="Nombre y apellido"
            aria-label="Nombre y apellido"
            className="border border-gpar-line bg-gpar-surface px-3 py-3 text-sm outline-none focus:border-gpar-orange-ink"
          />
          <input
            name="contacto"
            required
            placeholder="Teléfono o correo"
            aria-label="Teléfono o correo"
            className="border border-gpar-line bg-gpar-surface px-3 py-3 text-sm outline-none focus:border-gpar-orange-ink"
          />
          <input
            name="empresa"
            placeholder="Empresa (opcional)"
            aria-label="Empresa"
            className="border border-gpar-line bg-gpar-surface px-3 py-3 text-sm outline-none focus:border-gpar-orange-ink"
          />
          <textarea
            name="detalle"
            rows={4}
            required
            placeholder="Indica los productos que necesitas o el equipo donde se instalan"
            aria-label="Detalle"
            className="resize-y border border-gpar-line bg-gpar-surface px-3 py-3 text-sm outline-none focus:border-gpar-orange-ink"
          />
          <small className="text-[12.5px] text-gpar-ink-2">
            {totalUnidades > 0 ? (
              <>
                Tu lista actual ({totalUnidades}{" "}
                {totalUnidades === 1 ? "ítem" : "ítems"}) se adjunta a la
                solicitud.{" "}
                <button
                  type="button"
                  onClick={abrirDrawer}
                  className="font-semibold text-gpar-orange-ink underline-offset-2 hover:underline"
                >
                  Ver lista
                </button>
              </>
            ) : (
              "Puedes armar una lista de productos antes de enviar la solicitud."
            )}
          </small>
          <button
            type="submit"
            disabled={pendiente}
            className="inline-flex min-h-11 w-full items-center justify-center bg-gpar-orange px-6 text-sm font-bold text-gpar-ink hover:bg-gpar-orange-ink disabled:opacity-60"
          >
            {pendiente ? "Enviando…" : "Solicitar cotización"}
          </button>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center border border-gpar-ink bg-gpar-bg px-6 text-sm font-semibold text-gpar-ink hover:bg-gpar-ink hover:text-white"
            >
              Enviar por WhatsApp
            </a>
          ) : null}
          {mensaje ? (
            <p role="status" className="text-sm text-gpar-ink">
              {mensaje}
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </form>
      </Contenedor>
    </section>
  );
}
