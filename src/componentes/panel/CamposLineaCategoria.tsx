"use client";

import { useMemo, useState } from "react";

import { LINEAS_CATALOGO, type LineaPrisma } from "@/datos/lineas";

export type CategoriaOpcion = {
  id: string;
  nombre: string;
  linea: LineaPrisma;
};

type Props = {
  categorias: CategoriaOpcion[];
  lineaInicial?: LineaPrisma;
  categoriaIdInicial?: string;
};

export function CamposLineaCategoria({
  categorias,
  lineaInicial = "INDUSTRIAL",
  categoriaIdInicial = "",
}: Props) {
  const [linea, setLinea] = useState<LineaPrisma>(lineaInicial);
  const filtradas = useMemo(
    () => categorias.filter((c) => c.linea === linea),
    [categorias, linea],
  );
  const categoriaDefault = filtradas.some((c) => c.id === categoriaIdInicial)
    ? categoriaIdInicial
    : "";

  return (
    <>
      <label className="grid gap-1 text-sm">
        <span className="font-semibold text-[#1D2430]">Línea</span>
        <select
          name="linea"
          required
          value={linea}
          onChange={(e) => setLinea(e.target.value as LineaPrisma)}
          className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
        >
          {LINEAS_CATALOGO.map((opcion) => (
            <option key={opcion.prisma} value={opcion.prisma}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-semibold text-[#1D2430]">Categoría</span>
        <select
          key={linea}
          name="categoriaId"
          required
          defaultValue={categoriaDefault}
          className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
        >
          <option value="" disabled>
            Selecciona…
          </option>
          {filtradas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
