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
 * Datos temporales centralizados.
 * Sustituir por información confirmada cuando esté disponible.
 */
export const empresa: Empresa = {
  nombre: "GPar",
  nombreLegal: "Distribuidora GPar",
  eslogan: "Soluciones industriales que mantienen tu operación en movimiento.",
  descripcion:
    "Consulta categorías de repuestos, componentes y productos industriales y solicita cotizaciones a Distribuidora GPar.",
  urlSitio: "https://gparsoluciones.com",
  desarrollador: "ITConectados",
  contacto: {
    whatsapp: {
      etiqueta: "WhatsApp",
      valor: null,
      href: null,
      disponible: false,
    },
    correo: {
      etiqueta: "Correo",
      valor: null,
      href: null,
      disponible: false,
    },
    direccion: {
      etiqueta: "Dirección",
      valor: null,
      href: null,
      disponible: false,
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
      valor: null,
      href: null,
      disponible: false,
    },
    facebook: {
      etiqueta: "Facebook",
      valor: null,
      href: null,
      disponible: false,
    },
    maps: {
      etiqueta: "Google Maps",
      valor: null,
      href: null,
      disponible: false,
    },
  },
};
