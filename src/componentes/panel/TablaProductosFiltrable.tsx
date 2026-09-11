"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

type FilaProducto = {
  id: string;
  codigo: string;
  nombre: string;
  linea: string;
  categoriaNombre: string;
  visibleWeb: boolean;
  tokenPublico: string;
  imagenUrl: string | null;
};

type Filtros = {
  codigo: string;
  nombre: string;
  linea: string;
  categoria: string;
  web: string;
};

const FILTROS_VACIOS: Filtros = {
  codigo: "",
  nombre: "",
  linea: "",
  categoria: "",
  web: "",
};

const STORAGE_KEY = "gpar:filtros-panel-productos";

type ColumnaFiltro = keyof Filtros;

function leerFiltrosGuardados(): Filtros {
  if (typeof window === "undefined") return FILTROS_VACIOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return FILTROS_VACIOS;
    return { ...FILTROS_VACIOS, ...JSON.parse(raw) };
  } catch {
    return FILTROS_VACIOS;
  }
}

let cacheFiltros: Filtros | null = null;
const listenersFiltros = new Set<() => void>();

function getFiltrosSnapshot(): Filtros {
  if (cacheFiltros === null) cacheFiltros = leerFiltrosGuardados();
  return cacheFiltros;
}

function getFiltrosServerSnapshot(): Filtros {
  return FILTROS_VACIOS;
}

function subscribeFiltros(onStoreChange: () => void) {
  listenersFiltros.add(onStoreChange);
  return () => listenersFiltros.delete(onStoreChange);
}

function escribirFiltros(siguiente: Filtros) {
  cacheFiltros = siguiente;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente));
  listenersFiltros.forEach((l) => l());
}

function PanelFiltro({
  valorInicial,
  onAplicar,
  onCerrar,
  etiqueta,
  opciones,
}: {
  valorInicial: string;
  onAplicar: (valor: string) => void;
  onCerrar: () => void;
  etiqueta: string;
  opciones?: { valor: string; etiqueta: string }[];
}) {
  const [borrador, setBorrador] = useState(valorInicial);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) onCerrar();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onCerrar]);

  function enviar(e: FormEvent) {
    e.preventDefault();
    onAplicar(borrador.trim());
  }

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full z-30 mt-1 w-52 border border-[#E4E7EC] bg-white p-2 shadow-[0_8px_24px_rgba(29,36,48,0.12)]"
    >
      <form onSubmit={enviar} className="flex flex-col gap-2">
        {opciones ? (
          <select
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            className="min-h-9 border border-[#E4E7EC] bg-[#F7F8FA] px-2 text-xs text-[#1D2430]"
            autoFocus
          >
            <option value="">Todos</option>
            {opciones.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.etiqueta}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            placeholder={`Filtrar ${etiqueta.toLowerCase()}…`}
            className="min-h-9 border border-[#E4E7EC] bg-[#F7F8FA] px-2 text-xs text-[#1D2430]"
            autoFocus
          />
        )}
        <div className="flex gap-1.5">
          <button
            type="submit"
            className="min-h-8 flex-1 bg-[#F57C00] px-2 text-[11px] font-bold text-[#1D2430]"
          >
            Guardar
          </button>
          <button
            type="button"
            className="min-h-8 px-2 text-[11px] font-semibold text-[#5C6675] hover:text-[#1D2430]"
            onClick={() => onAplicar("")}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}

function CabeceraConLapiz({
  etiqueta,
  columna,
  valor,
  activo,
  abierto,
  onToggle,
  onAplicar,
  onCerrar,
  opciones,
}: {
  etiqueta: string;
  columna: ColumnaFiltro;
  valor: string;
  activo: boolean;
  abierto: boolean;
  onToggle: () => void;
  onAplicar: (valor: string) => void;
  onCerrar: () => void;
  opciones?: { valor: string; etiqueta: string }[];
}) {
  return (
    <th className="relative px-3 py-2 font-semibold">
      <div className="flex items-center gap-1">
        <span>{etiqueta}</span>
        <button
          type="button"
          aria-label={`Filtrar ${etiqueta}`}
          aria-expanded={abierto}
          onClick={onToggle}
          className={`inline-flex size-6 items-center justify-center transition-colors ${
            activo
              ? "text-[#F57C00]"
              : "text-[#98A2B3] hover:text-[#1D2430]"
          }`}
        >
          <Pencil className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>
      {abierto ? (
        <PanelFiltro
          key={`${columna}-${valor}`}
          valorInicial={valor}
          onAplicar={onAplicar}
          onCerrar={onCerrar}
          etiqueta={etiqueta}
          opciones={opciones}
        />
      ) : null}
      <span className="sr-only">{columna}</span>
    </th>
  );
}

export function TablaProductosFiltrable({
  productos,
}: {
  productos: FilaProducto[];
}) {
  const filtros = useSyncExternalStore(
    subscribeFiltros,
    getFiltrosSnapshot,
    getFiltrosServerSnapshot,
  );
  const [abierto, setAbierto] = useState<ColumnaFiltro | null>(null);

  function guardarFiltros(siguiente: Filtros) {
    escribirFiltros(siguiente);
    setAbierto(null);
  }

  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoriaNombre));
    return [...set].sort((a, b) => a.localeCompare(b, "es"));
  }, [productos]);

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      if (
        filtros.codigo &&
        !p.codigo.toLowerCase().includes(filtros.codigo.toLowerCase())
      ) {
        return false;
      }
      if (
        filtros.nombre &&
        !p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      ) {
        return false;
      }
      if (filtros.linea && p.linea !== filtros.linea) return false;
      if (filtros.categoria && p.categoriaNombre !== filtros.categoria) {
        return false;
      }
      if (filtros.web === "si" && !p.visibleWeb) return false;
      if (filtros.web === "no" && p.visibleWeb) return false;
      return true;
    });
  }, [productos, filtros]);

  const hayFiltros = Object.values(filtros).some(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C6675]">
        <p>
          {filtrados.length} de {productos.length} visibles
          {hayFiltros ? " · filtros activos" : null}
        </p>
        {hayFiltros ? (
          <button
            type="button"
            className="font-semibold text-[#D96A00] hover:underline"
            onClick={() => guardarFiltros(FILTROS_VACIOS)}
          >
            Quitar filtros
          </button>
        ) : null}
      </div>

      <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
            <tr>
              <th className="px-3 py-2 font-semibold">Foto</th>
              <CabeceraConLapiz
                etiqueta="Código"
                columna="codigo"
                valor={filtros.codigo}
                activo={!!filtros.codigo}
                abierto={abierto === "codigo"}
                onToggle={() =>
                  setAbierto((a) => (a === "codigo" ? null : "codigo"))
                }
                onAplicar={(v) => guardarFiltros({ ...filtros, codigo: v })}
                onCerrar={() => setAbierto(null)}
              />
              <CabeceraConLapiz
                etiqueta="Nombre"
                columna="nombre"
                valor={filtros.nombre}
                activo={!!filtros.nombre}
                abierto={abierto === "nombre"}
                onToggle={() =>
                  setAbierto((a) => (a === "nombre" ? null : "nombre"))
                }
                onAplicar={(v) => guardarFiltros({ ...filtros, nombre: v })}
                onCerrar={() => setAbierto(null)}
              />
              <CabeceraConLapiz
                etiqueta="Línea"
                columna="linea"
                valor={filtros.linea}
                activo={!!filtros.linea}
                abierto={abierto === "linea"}
                onToggle={() =>
                  setAbierto((a) => (a === "linea" ? null : "linea"))
                }
                onAplicar={(v) => guardarFiltros({ ...filtros, linea: v })}
                onCerrar={() => setAbierto(null)}
                opciones={[
                  { valor: "INDUSTRIAL", etiqueta: "Industrial" },
                  { valor: "CARGA_PESADA", etiqueta: "Carga Pesada" },
                ]}
              />
              <CabeceraConLapiz
                etiqueta="Categoría"
                columna="categoria"
                valor={filtros.categoria}
                activo={!!filtros.categoria}
                abierto={abierto === "categoria"}
                onToggle={() =>
                  setAbierto((a) => (a === "categoria" ? null : "categoria"))
                }
                onAplicar={(v) => guardarFiltros({ ...filtros, categoria: v })}
                onCerrar={() => setAbierto(null)}
                opciones={categorias.map((c) => ({ valor: c, etiqueta: c }))}
              />
              <CabeceraConLapiz
                etiqueta="Web"
                columna="web"
                valor={filtros.web}
                activo={!!filtros.web}
                abierto={abierto === "web"}
                onToggle={() => setAbierto((a) => (a === "web" ? null : "web"))}
                onAplicar={(v) => guardarFiltros({ ...filtros, web: v })}
                onCerrar={() => setAbierto(null)}
                opciones={[
                  { valor: "si", etiqueta: "Visible" },
                  { valor: "no", etiqueta: "Oculto" },
                ]}
              />
              <th className="px-3 py-2 font-semibold">QR</th>
              <th className="px-3 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((producto) => (
              <tr
                key={producto.id}
                className="border-b border-[#EEF0F3] last:border-0"
              >
                <td className="px-3 py-2">
                  <div className="relative size-10 overflow-hidden border border-[#E4E7EC] bg-[#F7F8FA]">
                    {producto.imagenUrl ? (
                      <Image
                        src={producto.imagenUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center font-mono text-[9px] text-[#98A2B3]">
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-[#1D2430]">
                  {producto.codigo}
                </td>
                <td className="px-3 py-2 text-[#1D2430]">{producto.nombre}</td>
                <td className="px-3 py-2 capitalize text-[#5C6675]">
                  {producto.linea.toLowerCase()}
                </td>
                <td className="px-3 py-2 text-[#5C6675]">
                  {producto.categoriaNombre}
                </td>
                <td className="px-3 py-2 text-[#5C6675]">
                  {producto.visibleWeb ? "Sí" : "No"}
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/p/${producto.tokenPublico}`}
                    className="font-mono text-xs text-[#D96A00] hover:underline"
                    target="_blank"
                  >
                    Abrir ficha
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/panel/productos/${producto.id}/editar`}
                    className="mr-3 text-xs font-semibold text-[#D96A00] hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/panel/productos/${producto.id}/etiqueta`}
                    className="text-xs font-semibold text-[#1D2430] hover:underline"
                  >
                    Imprimir QR
                  </Link>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-sm text-[#5C6675]"
                >
                  Ningún producto coincide con los filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
