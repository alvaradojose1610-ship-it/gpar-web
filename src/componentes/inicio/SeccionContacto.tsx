"use client";

import { FormEvent, useState } from "react";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { EncabezadoSeccion } from "@/componentes/interfaz/EncabezadoSeccion";
import { Boton } from "@/componentes/interfaz/Boton";
import { empresa } from "@/configuracion/empresa";
import type { DatoContacto } from "@/configuracion/empresa";

export function SeccionContacto() {
  const [mensaje, setMensaje] = useState<string | null>(null);

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje("Este formulario será habilitado próximamente.");
  }

  const mediosConfirmados = [
    empresa.contacto.whatsapp,
    empresa.contacto.correo,
    empresa.contacto.telefono,
    empresa.contacto.direccion,
  ].filter((medio) => medio.disponible && medio.valor && medio.href);

  const pendientes = [
    empresa.contacto.whatsapp,
    empresa.contacto.correo,
    empresa.contacto.telefono,
    empresa.contacto.direccion,
  ].filter((medio) => !medio.disponible);

  return (
    <section id="contacto" className="seccion scroll-mt-28 bg-blanco">
      <Contenedor className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <EncabezadoSeccion
            className="mb-5"
            etiqueta="Contacto"
            titulo="Solicita atención comercial"
            descripcion="Completa el formulario. Los medios confirmados aparecerán aquí."
          />

          {mediosConfirmados.length > 0 ? (
            <ul className="mb-4 space-y-2">
              {mediosConfirmados.map((medio) => (
                <MedioConfirmado key={medio.etiqueta} medio={medio} />
              ))}
            </ul>
          ) : null}

          {pendientes.length > 0 ? (
            <ul className="space-y-2">
              {pendientes.map((medio) => (
                <li
                  key={medio.etiqueta}
                  className="rounded-md border border-borde bg-fondo px-3.5 py-2.5 text-sm text-acero/65"
                >
                  <span className="font-semibold text-acero">{medio.etiqueta}: </span>
                  Próximamente
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <form
          onSubmit={manejarEnvio}
          className="space-y-4 rounded-lg border border-borde bg-fondo p-5 sm:p-6"
          noValidate
        >
          <Campo label="Nombre" name="nombre" required />
          <Campo
            label="Teléfono o correo"
            name="contacto"
            required
            placeholder="Teléfono o correo"
          />
          <Campo label="Empresa (opcional)" name="empresa" />
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-acero">Solicitud</span>
            <textarea
              name="solicitud"
              rows={4}
              required
              className="w-full rounded-md border border-borde bg-blanco px-3.5 py-2.5 text-sm text-acero outline-none transition-colors focus:border-naranja focus-visible:ring-2 focus-visible:ring-naranja"
            />
          </label>
          <Boton type="submit" tamano="md" className="w-full sm:w-auto">
            Enviar solicitud
          </Boton>
          {mensaje ? (
            <p
              role="status"
              className="rounded-md border border-borde bg-blanco px-3.5 py-2.5 text-sm text-acero/75"
            >
              {mensaje}
            </p>
          ) : null}
        </form>
      </Contenedor>
    </section>
  );
}

function MedioConfirmado({ medio }: { medio: DatoContacto }) {
  return (
    <li className="rounded-md border border-borde bg-fondo px-3.5 py-2.5 text-sm">
      <span className="font-semibold text-acero">{medio.etiqueta}: </span>
      <a
        href={medio.href!}
        className="font-semibold text-naranja hover:text-naranja-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
      >
        {medio.valor}
      </a>
    </li>
  );
}

function Campo({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-acero">{label}</span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-borde bg-blanco px-3.5 py-2.5 text-sm text-acero outline-none transition-colors focus:border-naranja focus-visible:ring-2 focus-visible:ring-naranja"
      />
    </label>
  );
}
