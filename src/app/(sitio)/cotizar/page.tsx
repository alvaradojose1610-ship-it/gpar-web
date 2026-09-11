import type { Metadata } from "next";
import { SeccionCotizacion } from "@/componentes/inicio/SeccionCotizacion";
import { Contenedor } from "@/componentes/interfaz/Contenedor";

export const metadata: Metadata = {
  title: "Solicitar cotización",
  description:
    "Arma tu lista y solicita cotización a Distribuidora GPar por WhatsApp.",
};

export default function PaginaCotizar() {
  return (
    <>
      <div className="border-b border-gpar-line bg-gpar-surface">
        <Contenedor className="py-8">
          <p className="mb-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-gpar-orange-ink">
            Cotización
          </p>
          <h1 className="font-display text-[clamp(32px,4.4vw,46px)] font-extrabold uppercase leading-none text-gpar-ink">
            Solicita tu cotización
          </h1>
          <p className="mt-3 max-w-[54ch] text-[15.5px] text-gpar-ink-2">
            Sin pago en línea: envías la lista y te respondemos con precio,
            disponibilidad y tiempo de entrega.
          </p>
        </Contenedor>
      </div>
      <SeccionCotizacion />
    </>
  );
}
