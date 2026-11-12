import {
  hrefWhatsApp,
  mensajePresupuestoCotizacion,
  type LineaWhatsAppCotizacion,
} from "@/utilidades/whatsapp";

type Props = {
  telefono: string | null | undefined;
  nombreContacto: string;
  numero: string;
  mensaje?: string | null;
  detalles: LineaWhatsAppCotizacion[];
  variante?: "boton" | "enlace";
};

export function EnlaceWhatsAppCotizacion({
  telefono,
  nombreContacto,
  numero,
  mensaje,
  detalles,
  variante = "boton",
}: Props) {
  if (!telefono) return null;

  const href = hrefWhatsApp(
    telefono,
    mensajePresupuestoCotizacion({
      nombreContacto,
      numero,
      mensaje,
      detalles,
    }),
  );
  if (!href) return null;

  if (variante === "enlace") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Enviar presupuesto de ${numero} por WhatsApp`}
        className="text-sm font-semibold text-[#128C7E] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E]"
      >
        WhatsApp
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Enviar presupuesto de ${numero} por WhatsApp`}
      className="inline-flex min-h-10 w-full items-center justify-center bg-[#128C7E] px-4 text-sm font-bold text-white hover:bg-[#0E7A6E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] sm:w-auto"
    >
      Enviar presupuesto por WhatsApp
    </a>
  );
}
