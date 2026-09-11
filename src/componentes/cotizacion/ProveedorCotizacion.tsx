"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { productosCatalogo } from "@/datos/catalogo";
import type { ProductoCatalogo } from "@/datos/tipos-catalogo";

const CLAVE_STORAGE = "gpar:cotizacion";

type ItemGuardado = { cantidad: number; nombre: string };

export type ItemCotizacion = {
  codigo: string;
  cantidad: number;
  producto: ProductoCatalogo;
};

type EstadoCotizacion = Record<string, ItemGuardado>;

type ContextoCotizacion = {
  items: ItemCotizacion[];
  totalUnidades: number;
  drawerAbierto: boolean;
  abrirDrawer: () => void;
  cerrarDrawer: () => void;
  estaEnCotizacion: (codigo: string) => boolean;
  cantidadDe: (codigo: string) => number;
  agregar: (codigo: string, cantidad?: number, nombre?: string) => void;
  quitar: (codigo: string) => void;
  establecerCantidad: (codigo: string, cantidad: number) => void;
  mensajeWhatsApp: string;
};

const CotizacionContext = createContext<ContextoCotizacion | null>(null);

function leerStorage(): EstadoCotizacion {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CLAVE_STORAGE);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const limpio: EstadoCotizacion = {};
    for (const [codigo, valor] of Object.entries(
      parsed as Record<string, unknown>,
    )) {
      if (typeof valor === "number" && valor > 0 && Number.isFinite(valor)) {
        const cat = productosCatalogo.find((p) => p.codigo === codigo);
        limpio[codigo] = {
          cantidad: Math.floor(valor),
          nombre: cat?.nombre ?? codigo,
        };
      } else if (
        valor &&
        typeof valor === "object" &&
        "cantidad" in valor &&
        typeof (valor as ItemGuardado).cantidad === "number" &&
        (valor as ItemGuardado).cantidad > 0
      ) {
        const item = valor as ItemGuardado;
        limpio[codigo] = {
          cantidad: Math.floor(item.cantidad),
          nombre: item.nombre || codigo,
        };
      }
    }
    return limpio;
  } catch {
    return {};
  }
}

function productoVirtual(
  codigo: string,
  nombre: string,
): ProductoCatalogo {
  const real = productosCatalogo.find((p) => p.codigo === codigo);
  if (real) return real;
  return {
    id: codigo,
    linea: "industrial",
    categoriaId: "otros",
    codigo,
    nombre,
    descripcion: nombre,
  };
}

function construirMensajeWhatsApp(items: ItemCotizacion[]): string {
  if (items.length === 0) {
    return [
      "Hola GPar, quisiera solicitar una *cotización* de los siguientes productos:",
      "",
      "(Todavía no seleccioné productos, necesito asesoría para identificar la pieza)",
      "",
      "Gracias.",
    ].join("\n");
  }

  const lineas = items.map(
    (item) =>
      `• ${item.producto.nombre} (${item.codigo}) x${item.cantidad}`,
  );

  return [
    "Hola GPar, quisiera solicitar una *cotización* de los siguientes productos:",
    "",
    ...lineas,
    "",
    "Gracias.",
  ].join("\n");
}

export function ProveedorCotizacion({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoCotizacion>({});
  const [hidratado, setHidratado] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  useEffect(() => {
    setEstado(leerStorage());
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado));
  }, [estado, hidratado]);

  const items = useMemo(() => {
    const resultado: ItemCotizacion[] = [];
    for (const [codigo, item] of Object.entries(estado)) {
      if (item.cantidad > 0) {
        resultado.push({
          codigo,
          cantidad: item.cantidad,
          producto: productoVirtual(codigo, item.nombre),
        });
      }
    }
    return resultado;
  }, [estado]);

  const totalUnidades = useMemo(
    () => items.reduce((acc, item) => acc + item.cantidad, 0),
    [items],
  );

  const estaEnCotizacion = useCallback(
    (codigo: string) => (estado[codigo]?.cantidad ?? 0) > 0,
    [estado],
  );

  const cantidadDe = useCallback(
    (codigo: string) => estado[codigo]?.cantidad ?? 0,
    [estado],
  );

  const agregar = useCallback(
    (codigo: string, cantidad = 1, nombre?: string) => {
      const cat = productosCatalogo.find((p) => p.codigo === codigo);
      const etiqueta = nombre || cat?.nombre || codigo;
      setEstado((prev) => ({
        ...prev,
        [codigo]: {
          cantidad:
            (prev[codigo]?.cantidad ?? 0) + Math.max(1, Math.floor(cantidad)),
          nombre: prev[codigo]?.nombre || etiqueta,
        },
      }));
    },
    [],
  );

  const quitar = useCallback((codigo: string) => {
    setEstado((prev) => {
      const siguiente = { ...prev };
      delete siguiente[codigo];
      return siguiente;
    });
  }, []);

  const establecerCantidad = useCallback((codigo: string, cantidad: number) => {
    const n = Math.floor(cantidad);
    setEstado((prev) => {
      if (n <= 0) {
        const siguiente = { ...prev };
        delete siguiente[codigo];
        return siguiente;
      }
      const nombre = prev[codigo]?.nombre || codigo;
      return { ...prev, [codigo]: { cantidad: n, nombre } };
    });
  }, []);

  const mensajeWhatsApp = useMemo(
    () => construirMensajeWhatsApp(items),
    [items],
  );

  const valor = useMemo<ContextoCotizacion>(
    () => ({
      items,
      totalUnidades,
      drawerAbierto,
      abrirDrawer: () => setDrawerAbierto(true),
      cerrarDrawer: () => setDrawerAbierto(false),
      estaEnCotizacion,
      cantidadDe,
      agregar,
      quitar,
      establecerCantidad,
      mensajeWhatsApp,
    }),
    [
      items,
      totalUnidades,
      drawerAbierto,
      estaEnCotizacion,
      cantidadDe,
      agregar,
      quitar,
      establecerCantidad,
      mensajeWhatsApp,
    ],
  );

  return (
    <CotizacionContext.Provider value={valor}>
      {children}
    </CotizacionContext.Provider>
  );
}

export function useCotizacion(): ContextoCotizacion {
  const ctx = useContext(CotizacionContext);
  if (!ctx) {
    throw new Error("useCotizacion debe usarse dentro de ProveedorCotizacion");
  }
  return ctx;
}
