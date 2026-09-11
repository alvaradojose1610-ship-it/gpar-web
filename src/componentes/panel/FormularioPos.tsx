"use client";

import { useState, useTransition } from "react";

import {
  EscanerQrProducto,
  type ResultadoEscaneoQr,
} from "@/componentes/panel/EscanerQrProducto";
import {
  accionConfirmarVenta,
  buscarProductoParaVenta,
  type ProductoPos,
} from "@/modulos/ventas/acciones";

type Linea = {
  productoId: string;
  codigo: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  stock: number;
};

type Props = {
  tieneCajaAbierta: boolean;
};

export function FormularioPos({ tieneCajaAbierta }: Props) {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [precio, setPrecio] = useState("");
  const [producto, setProducto] = useState<ProductoPos | null>(null);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function aplicarProductoHallado(hallado: ProductoPos) {
    setProducto(hallado);
    setCodigo(hallado.codigo);
    setPrecio(String(hallado.precioVenta || ""));
    if (hallado.stock <= 0) {
      setMensaje(`Sin stock disponible (${hallado.stock}).`);
    } else {
      setMensaje(null);
    }
  }

  function agregarProductoALineas(
    hallado: ProductoPos,
    cant: number,
    precioNum: number,
  ): string | null {
    let errorStock: string | null = null;

    setLineas((prev) => {
      const ya = prev.find((l) => l.productoId === hallado.id);
      const cantidadFinal = (ya?.cantidad ?? 0) + cant;
      if (cantidadFinal > hallado.stock) {
        errorStock = `Stock insuficiente para ${hallado.codigo}. Disponible: ${hallado.stock}.`;
        return prev;
      }

      const idx = prev.findIndex((l) => l.productoId === hallado.id);
      if (idx >= 0) {
        const copia = [...prev];
        copia[idx] = {
          ...copia[idx],
          cantidad: copia[idx].cantidad + cant,
          precioUnitario: precioNum,
        };
        return copia;
      }
      return [
        ...prev,
        {
          productoId: hallado.id,
          codigo: hallado.codigo,
          nombre: hallado.nombre,
          cantidad: cant,
          precioUnitario: precioNum,
          stock: hallado.stock,
        },
      ];
    });

    if (errorStock) return errorStock;

    setCodigo("");
    setProducto(null);
    setCantidad("1");
    setPrecio("");
    return null;
  }

  function buscar() {
    setMensaje(null);
    startTransition(async () => {
      const hallado = await buscarProductoParaVenta(codigo);
      if (!hallado) {
        setProducto(null);
        setMensaje("No se encontró un producto con ese código o QR.");
        return;
      }
      aplicarProductoHallado(hallado);
    });
  }

  async function alEscanearQr(contenido: string): Promise<ResultadoEscaneoQr> {
    const hallado = await buscarProductoParaVenta(contenido);
    if (!hallado) {
      return {
        ok: false,
        error: "No se encontró un producto para este QR.",
      };
    }
    if (hallado.stock <= 0) {
      aplicarProductoHallado(hallado);
      return {
        ok: false,
        error: `Sin stock: ${hallado.codigo} · ${hallado.nombre}.`,
      };
    }

    const errorStock = agregarProductoALineas(
      hallado,
      1,
      hallado.precioVenta || 0,
    );
    if (errorStock) {
      aplicarProductoHallado(hallado);
      return { ok: false, error: errorStock };
    }

    setMensaje(`Agregado: ${hallado.codigo} · ${hallado.nombre}`);
    return { ok: true };
  }

  function agregarLinea() {
    if (!producto) {
      setMensaje("Busca un producto por código o escanea el QR primero.");
      return;
    }
    const cant = Number(cantidad);
    const precioNum = Number(precio);
    if (!(cant > 0) || !(precioNum >= 0)) {
      setMensaje("Cantidad y precio deben ser válidos.");
      return;
    }

    const errorStock = agregarProductoALineas(producto, cant, precioNum);
    if (errorStock) {
      setMensaje(errorStock);
      return;
    }
    setMensaje(null);
  }

  function quitar(productoId: string) {
    setLineas((prev) => prev.filter((l) => l.productoId !== productoId));
  }

  const total = lineas.reduce(
    (acc, l) => acc + l.cantidad * l.precioUnitario,
    0,
  );

  return (
    <div className="grid gap-6">
      {!tieneCajaAbierta ? (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          No hay caja abierta. La venta se registrará sin movimiento de caja.
        </p>
      ) : null}

      <div className="grid gap-3 border border-[#E4E7EC] bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#5C6675]">
          Buscar producto
        </h2>
        <div className="flex flex-wrap gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código o URL del QR"
            className="min-w-[10rem] flex-1 border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 text-sm"
            autoFocus
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
          <EscanerQrProducto onCodigo={alEscanearQr} />
        </div>
        {producto ? (
          <p className="text-sm text-[#1D2430]">
            <span className="font-mono text-xs">{producto.codigo}</span> ·{" "}
            {producto.nombre} · Stock: {producto.stock}
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
            <span className="font-semibold text-[#1D2430]">Precio</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={agregarLinea}
          className="inline-flex min-h-10 max-w-xs items-center justify-center border border-[#E4E7EC] bg-[#F7F8FA] px-4 text-sm font-semibold text-[#1D2430] hover:bg-white"
        >
          Agregar línea
        </button>
        {mensaje ? (
          <p
            className={`text-sm ${mensaje.startsWith("Agregado") ? "text-[#1D2430]" : "text-red-700"}`}
          >
            {mensaje}
          </p>
        ) : null}
      </div>

      <form action={accionConfirmarVenta} className="grid gap-4">
        <label className="grid max-w-xl gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">
            Cliente (opcional)
          </span>
          <input
            name="nombreCliente"
            placeholder="Nombre"
            className="border border-[#E4E7EC] bg-white px-3 py-2"
          />
        </label>
        <label className="grid max-w-xl gap-1 text-sm">
          <span className="font-semibold text-[#1D2430]">Observaciones</span>
          <textarea
            name="observaciones"
            rows={2}
            className="border border-[#E4E7EC] bg-white px-3 py-2"
          />
        </label>

        <input
          type="hidden"
          name="lineas"
          value={JSON.stringify(
            lineas.map(({ productoId, codigo, cantidad, precioUnitario }) => ({
              productoId,
              codigo,
              cantidad,
              precioUnitario,
            })),
          )}
        />

        <div className="overflow-x-auto border border-[#E4E7EC] bg-white">
          {lineas.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[#5C6675]">
              Sin líneas.
            </p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E4E7EC] bg-[#F7F8FA] text-xs uppercase tracking-[0.08em] text-[#5C6675]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Código</th>
                  <th className="px-3 py-2 font-semibold">Producto</th>
                  <th className="px-3 py-2 font-semibold">Cant.</th>
                  <th className="px-3 py-2 font-semibold">Precio</th>
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
                      {l.precioUnitario.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      {(l.cantidad * l.precioUnitario).toFixed(2)}
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

        <p className="text-lg font-semibold text-[#1D2430]">
          Total: {total.toFixed(2)} USD
        </p>

        <button
          type="submit"
          disabled={lineas.length === 0}
          className="inline-flex min-h-11 max-w-xs items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] hover:bg-[#D96A00] disabled:opacity-50"
        >
          Confirmar venta
        </button>
      </form>
    </div>
  );
}
