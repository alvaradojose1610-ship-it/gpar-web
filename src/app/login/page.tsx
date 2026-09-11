import type { Metadata } from "next";

import { FormularioLogin } from "@/componentes/panel/FormularioLogin";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function PaginaLogin({ searchParams }: Props) {
  const params = await searchParams;
  const next =
    params.next &&
    params.next.startsWith("/") &&
    !params.next.startsWith("//") &&
    params.next.startsWith("/panel")
      ? params.next
      : "/panel";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#F7F8FA]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <div className="border border-[#E4E7EC] bg-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F57C00]">
            Distribuidora GPar
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#1D2430]">
            Acceso al panel
          </h1>
          <p className="mt-2 text-sm text-[#5C6675]">
            Ingresa con tu usuario interno para gestionar catálogo, cotizaciones
            e inventario.
          </p>
          <FormularioLogin next={next} />
        </div>
        <p className="mt-6 text-center text-xs text-[#8A94A2]">
          Área restringida · solo personal autorizado
        </p>
      </div>
    </div>
  );
}
