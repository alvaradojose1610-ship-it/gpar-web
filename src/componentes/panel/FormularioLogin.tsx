"use client";

import { useActionState } from "react";

import {
  accionIniciarSesion,
  type ResultadoLogin,
} from "@/modulos/autenticacion/acciones";

type Props = {
  next: string;
};

export function FormularioLogin({ next }: Props) {
  const [estado, accion, pendiente] = useActionState<
    ResultadoLogin | null,
    FormData
  >(accionIniciarSesion, null);

  return (
    <form action={accion} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label
          htmlFor="usuario"
          className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#5C6675]"
        >
          Usuario
        </label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          required
          className="mt-2 w-full border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-3 text-sm text-[#1D2430] outline-none focus:border-[#F57C00] focus-visible:ring-2 focus-visible:ring-[#D96A00]"
        />
      </div>

      <div>
        <label
          htmlFor="clave"
          className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#5C6675]"
        >
          Contraseña
        </label>
        <input
          id="clave"
          name="clave"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-3 text-sm text-[#1D2430] outline-none focus:border-[#F57C00] focus-visible:ring-2 focus-visible:ring-[#D96A00]"
        />
      </div>

      {estado && !estado.ok ? (
        <p
          role="alert"
          className="border border-[#FBD3A8] bg-[#FFF3E6] px-3 py-2 text-sm text-[#1D2430]"
        >
          {estado.mensaje}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pendiente}
        className="w-full bg-[#F57C00] px-4 py-3 text-sm font-semibold text-white outline-none hover:bg-[#D96A00] focus-visible:ring-2 focus-visible:ring-[#D96A00] focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {pendiente ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
