/** Dígitos E.164 sin + para wa.me (Venezuela por defecto). */
export function digitosWhatsApp(telefono: string): string | null {
  let digitos = telefono.replace(/\D/g, "");
  if (digitos.startsWith("00")) {
    digitos = digitos.slice(2);
  }

  if (digitos.startsWith("0") && digitos.length === 11) {
    digitos = `58${digitos.slice(1)}`;
  } else if (digitos.length === 10) {
    digitos = `58${digitos}`;
  }

  if (digitos.length < 10 || digitos.length > 15) {
    return null;
  }
  return digitos;
}

export function hrefWhatsApp(
  telefono: string,
  texto?: string,
): string | null {
  const destino = digitosWhatsApp(telefono);
  if (!destino) return null;
  if (!texto) return `https://wa.me/${destino}`;
  return `https://wa.me/${destino}?text=${encodeURIComponent(texto)}`;
}

export type LineaWhatsAppCotizacion = {
  codigo: string;
  nombre: string;
  cantidad: number | string;
  precioUnitario?: number | string | null;
};

export function lineasWhatsAppDesdeDetalles(
  detalles: Array<{
    codigo: string;
    nombre: string;
    cantidad: { toString(): string };
    precioUnitario?: { toString(): string } | null;
  }>,
): LineaWhatsAppCotizacion[] {
  return detalles.map((d) => ({
    codigo: d.codigo,
    nombre: d.nombre,
    cantidad: d.cantidad.toString(),
    precioUnitario: d.precioUnitario?.toString() ?? null,
  }));
}

function formatearCantidad(valor: number | string): string {
  const n = Number(valor);
  if (!Number.isFinite(n)) return String(valor);
  return Number.isInteger(n) ? String(n) : n.toString();
}

function precioPositivo(valor: number | string | null | undefined): number | null {
  if (valor == null || valor === "") return null;
  const n = Number(valor);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Mensaje listo para enviar el pedido / presupuesto al cliente. */
export function mensajePresupuestoCotizacion(datos: {
  nombreContacto: string;
  numero: string;
  mensaje?: string | null;
  detalles: LineaWhatsAppCotizacion[];
}): string {
  const lineas = datos.detalles.map((d) => {
    const precio = precioPositivo(d.precioUnitario);
    const extra = precio != null ? ` — ${precio.toFixed(2)} c/u` : "";
    return `• ${d.nombre} (${d.codigo}) x${formatearCantidad(d.cantidad)}${extra}`;
  });

  const partes = [
    `Hola ${datos.nombreContacto}, te escribimos de Distribuidora GPar.`,
    "",
    `Sobre tu solicitud *${datos.numero}*:`,
  ];

  if (lineas.length > 0) {
    partes.push("", ...lineas);
  }

  const precios = datos.detalles.map((d) => precioPositivo(d.precioUnitario));
  const conPrecios =
    precios.length > 0 && precios.every((p) => p != null);
  if (conPrecios) {
    const total = datos.detalles.reduce((acc, d) => {
      const precio = precioPositivo(d.precioUnitario) ?? 0;
      return acc + precio * Number(d.cantidad);
    }, 0);
    partes.push("", `Total: ${total.toFixed(2)}`);
  }

  const notaCliente = datos.mensaje?.trim();
  if (notaCliente) {
    partes.push("", `Tu mensaje: ${notaCliente}`);
  }

  partes.push("");
  if (conPrecios) {
    partes.push(
      "Te enviamos el presupuesto. ¿Confirmas si deseas proceder?",
    );
  } else {
    partes.push(
      "Te contactamos para confirmarte precio, disponibilidad y tiempo de entrega.",
    );
  }

  return partes.join("\n");
}
