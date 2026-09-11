"use client";

import { useState, useTransition } from "react";

import {
  buscarProductoParaVenta,
  type ProductoPos,
} from "@/modulos/ventas/acciones";
import { accionCrearApartado } from "@/modulos/apartados/acciones";

type Linea = {
  productoId: string;
  codigo: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  stock: number;
};

export function FormularioNuevoApartado() {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [producto, setProducto] = useState<ProductoPos | null>(null);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function buscar() {
    startTransition(async () => {
      const hallado = await buscarProductoParaVenta(codigo);
      if (!hallado) {
        setProducto(null);
        setMensaje("Producto no encontrado.");
        return;
      }
      setProducto(hallado);
      setMensaje(
        hallado.stock <= 0
          ? `Sin disponible (${hallado.stock}).`
          : null,
      );
    });
  }

  function agregar() {
    if (!producto) return;
    const cant = Number(cantidad);
    if (!(cant > 0)) {
      setMensaje("Cantidad inválida.");
      return;
    }
    setLineas((prev) => {
      const ya = prev.find((l) => l.productoId === producto.id);
      const total = (ya?.cantidad ?? 0) + cant;
      if (total > producto.stock) {
        setMensaje(`Disponible: ${producto.stock}`);
        return prev;
      }
      if (ya) {
        return prev.map((l) =>
          l.productoId === producto.id ? { ...l, cantidad: total } : l,
        );
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          cantidad: cant,
          precioUnitario: producto.precioVenta,
          stock: producto.stock,
        },
      ];
    });
    setCodigo("");
    setProducto(null);
    setCantidad("1");
  }

  return (
    <form action={accionCrearApartado} className="grid gap-4">
      <div className="grid max-w-xl gap-3 border border-[#E4E7EC] bg-white p-4">
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Nombre contacto</span>
          <input
            name="nombreContacto"
            required
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Teléfono</span>
          <input
            name="telefono"
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Días de vigencia</span>
          <input
            name="diasVigencia"
            type="number"
            min={1}
            max={30}
            defaultValue={3}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Observaciones</span>
          <textarea
            name="observaciones"
            rows={2}
            className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
          />
        </label>
      </div>

      <div className="grid gap-3 border border-[#E4E7EC] bg-white p-4">
        <h2 className="text-sm font-semibold uppercase text-[#5C6675]">
          Productos
        </h2>
        <div className="flex flex-wrap gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código"
            className="min-w-[10rem] flex-1 border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={buscar}
            disabled={pending}
            className="border border-[#E4E7EC] px-4 text-sm font-semibold"
          >
            Buscar
          </button>
          <input
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            type="number"
            min={1}
            className="w-24 border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={agregar}
            className="bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430]"
          >
            Agregar
          </button>
        </div>
        {producto ? (
          <p className="text-sm text-[#5C6675]">
            {producto.codigo} · {producto.nombre} · disp. {producto.stock}
          </p>
        ) : null}
        {mensaje ? <p className="text-sm text-red-700">{mensaje}</p> : null}
      </div>

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
            <thead className="border-b bg-[#F7F8FA] text-xs uppercase text-[#5C6675]">
              <tr>
                <th className="px-3 py-2">Código</th>
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Cant.</th>
                <th className="px-3 py-2"> </th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((l) => (
                <tr key={l.productoId} className="border-b">
                  <td className="px-3 py-2 font-mono text-xs">{l.codigo}</td>
                  <td className="px-3 py-2">{l.nombre}</td>
                  <td className="px-3 py-2">{l.cantidad}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="text-sm text-red-700"
                      onClick={() =>
                        setLineas((prev) =>
                          prev.filter((x) => x.productoId !== l.productoId),
                        )
                      }
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

      <button
        type="submit"
        disabled={lineas.length === 0}
        className="inline-flex min-h-11 max-w-xs items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] disabled:opacity-50"
      >
        Crear apartado
      </button>
    </form>
  );
}
