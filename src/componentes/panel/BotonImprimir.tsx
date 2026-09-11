"use client";

type Props = {
  etiqueta?: string;
};

export function BotonImprimir({ etiqueta = "Imprimir etiqueta" }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm font-semibold text-[#1D2430] underline print:hidden"
    >
      {etiqueta}
    </button>
  );
}
