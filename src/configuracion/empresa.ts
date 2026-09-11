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

/**
 * Datos de empresa centralizados.
 * Correo, teléfono fijo y dirección textual: pendiente de confirmar.
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
      href: "https://maps.app.goo.gl/gUUG6rsq42k1fafH6",
      disponible: true,
    },
    telefono: {
      etiqueta: "Teléfono",
      valor: null,
      href: null,
      disponible: false,
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
      href: "https://maps.app.goo.gl/gUUG6rsq42k1fafH6",
      disponible: true,
    },
  },
};
