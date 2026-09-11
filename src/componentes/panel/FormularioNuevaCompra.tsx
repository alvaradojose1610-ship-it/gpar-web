"use client";

import { useState, useTransition } from "react";

import {
  buscarProductoParaCompra,
  accionConfirmarCompra,
  type ProductoBusqueda,
} from "@/modulos/compras/acciones";

type Linea = {
  productoId: string;
  codigo: string;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
};

type Props = {
  proveedores: { id: string; razonSocial: string }[];
};

export function FormularioNuevaCompra({ proveedores }: Props) {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [costo, setCosto] = useState("");
  const [producto, setProducto] = useState<ProductoBusqueda | null>(null);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function buscar() {
    setMensaje(null);
    startTransition(async () => {
      const hallado = await buscarProductoParaCompra(codigo);
      if (!hallado) {
        setProducto(null);
        setMensaje("No se encontró un producto con ese código.");
        return;
      }
      setProducto(hallado);
      setCosto(String(hallado.precioCosto || ""));
      setMensaje(null);
    });
  }

  function agregarLinea() {
    if (!producto) {
      setMensaje("Busca un producto por código primero.");
      return;
    }
    const cant = Number(cantidad);
    const costoNum = Number(costo);
    if (!(cant > 0) || !(costoNum >= 0)) {
      setMensaje("Cantidad y costo deben ser válidos.");
      return;
    }

    setLineas((prev) => {
      const idx = prev.findIndex((l) => l.productoId === producto.id);
      if (idx >= 0) {
        const copia = [...prev];
        copia[idx] = {
          ...copia[idx],
          cantidad: copia[idx].cantidad + cant,
          costoUnitario: costoNum,
        };
        return copia;
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          cantidad: cant,
          costoUnitario: costoNum,
        },
      ];
    });
    setCodigo("");
    setProducto(null);
    setCantidad("1");
    setCosto("");
    setMensaje(null);
  }

  function quitar(productoId: string) {
    setLineas((prev) => prev.filter((l) => l.productoId !== productoId));
  }

  const total = lineas.reduce(
    (acc, l) => acc + l.cantidad * l.costoUnitario,
    0,
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 border border-[#E4E7EC] bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#5C6675]">
          Agregar línea
        </h2>
        <div className="flex flex-wrap gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código producto"
            className="min-w-[10rem] flex-1 border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                buscar();
              }
            }}
          />
          <button
            type="button"
            onClick={buscar}
            disabled={pending}
            className="min-h-10 border border-[#E4E7EC] bg-white px-3 text-sm font-semibold text-[#1D2430] hover:bg-[#F7F8FA]"
          >
            Buscar
          </button>
        </div>
        {producto ? (
          <p className="text-sm text-[#1D2430]">
            <span className="font-mono text-xs">{producto.codigo}</span> ·{" "}
            {producto.nombre}
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-[#1D2430]">Cantidad</span>
            <input
              type="number"
              min="0.001"
              step="any"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-[#1D2430]">Costo unitario</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={agregarLinea}
          className="inline-flex min-h-10 max-w-xs items-center justify-center border border-[#E4E7EC] bg-[#F7F8FA] px-4 text-sm font-semibold text-[#1D2430] hover:bg-white"
        >
          Agregar a la compra
        </button>
        {mensaje ? (
          <p className="text-sm text-red-700">{mensaje}</p>
        ) : null}
      </div>

      <form action={accionConfirmarCompra} className="grid gap-4">
        <label className="grid max-w-xl gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Proveedor</span>
          <select
            name="proveedorId"
            required
            defaultValue=""
            className="border border-[#E4E7EC] bg-white px-3 py-2"
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.razonSocial}
              </option>
            ))}
          </select>
        </label>

        <label className="grid max-w-xl gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Observaciones</span>
          <textarea
            name="observaciones"
            rows={2}
            className="border border-[#E4E7EC] bg-white px-3 py-2"
          />
        </label>

        <input type="hidden" name="lineas" value={JSON.stringify(lineas)} />

        <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
          {lineas.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[#5C6675]">
              Sin líneas. Agrega productos arriba.
            </p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Código</th>
                  <th className="px-3 py-2 font-semibold">Producto</th>
                  <th className="px-3 py-2 font-semibold">Cant.</th>
                  <th className="px-3 py-2 font-semibold">Costo</th>
                  <th className="px-3 py-2 font-semibold">Subtotal</th>
                  <th className="px-3 py-2 font-semibold"> </th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((l) => (
                  <tr key={l.productoId} className="border-b border-[#EEF0F3]">
                    <td className="px-3 py-2 font-mono text-xs">{l.codigo}</td>
                    <td className="px-3 py-2">{l.nombre}</td>
                    <td className="px-3 py-2">{l.cantidad}</td>
                    <td className="px-3 py-2">
                      {l.costoUnitario.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      {(l.cantidad * l.costoUnitario).toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => quitar(l.productoId)}
                        className="text-sm font-semibold text-red-700 hover:underline"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-sm font-semibold text-[#1D2430]">
          Total: {total.toFixed(2)} USD
        </p>

        <button
          type="submit"
          disabled={lineas.length === 0}
          className="inline-flex min-h-11 max-w-xs items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00] disabled:opacity-50"
        >
          Confirmar compra
        </button>
      </form>
    </div>
  );
}
