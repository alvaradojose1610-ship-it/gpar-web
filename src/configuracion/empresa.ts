export type DatoContacto = {
  etiqueta: string;
  valor: string | null;
  href: string | null;
  disponible: boolean;
};

export type Empresa = {
  nombre: string;
  nombreLegal: string;
  eslogan: string;
  descripcion: string;
  urlSitio: string;
  desarrollador: string;
  contacto: {
    whatsapp: DatoContacto;
    correo: DatoContacto;
    direccion: DatoContacto;
    telefono: DatoContacto;
  };
  redes: {
    instagram: DatoContacto;
    facebook: DatoContacto;
    maps: DatoContacto;
  };
};

/** Ubicación confirmada en Google Maps (Distribuidora G´Par). */
const MAPS_UBICACION =
  "https://www.google.com/maps/place/Distribuidora+G%C2%B4Par/@10.0807562,-69.3255478,17z/data=!3m1!4b1!4m6!3m5!1s0x8e875dd08f25e9df:0xc689a15c99f6e72!8m2!3d10.0807562!4d-69.3255478!16s%2Fg%2F11bwkdqcsk";

/**
 * Datos de empresa centralizados.
 * Correo y dirección textual: pendiente de confirmar.
 */
export const empresa: Empresa = {
  nombre: "GPar",
  nombreLegal: "Distribuidora GPar",
  eslogan: "Soluciones industriales que mantienen tu operación en movimiento.",
  descripcion:
    "Consulta categorías de repuestos industriales y automotrices, y solicita cotizaciones a Distribuidora GPar.",
  urlSitio: "https://gparsoluciones.com",
  desarrollador: "ITConectados",
  contacto: {
    whatsapp: {
      etiqueta: "WhatsApp",
      valor: "+58 424-5140003",
      href: "https://wa.me/584245140003",
      disponible: true,
    },
    correo: {
      etiqueta: "Correo",
      valor: null,
      href: null,
      disponible: false,
    },
    direccion: {
      etiqueta: "Ubicación",
      valor: "Ver en Google Maps",
      href: MAPS_UBICACION,
      disponible: true,
    },
    telefono: {
      etiqueta: "Teléfono",
      valor: "+58 412-3770003",
      href: "tel:+584123770003",
      disponible: true,
    },
  },
  redes: {
    instagram: {
      etiqueta: "Instagram",
      valor: "@distribuidoragpar",
      href: "https://www.instagram.com/distribuidoragpar",
      disponible: true,
    },
    facebook: {
      etiqueta: "Facebook",
      valor: null,
      href: null,
      disponible: false,
    },
    maps: {
      etiqueta: "Google Maps",
      valor: "Ubicación",
      href: MAPS_UBICACION,
      disponible: true,
    },
  },
};
