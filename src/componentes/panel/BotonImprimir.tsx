"use client";

export function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm font-semibold text-[#1D2430] underline print:hidden"
    >
      Imprimir etiqueta
    </button>
  );
}
