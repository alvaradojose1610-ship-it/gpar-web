"use client";

import { useMemo, useState } from "react";

export type CategoriaOpcion = {
  id: string;
  nombre: string;
  linea: "INDUSTRIAL" | "CARGA_PESADA";
};

type Props = {
  categorias: CategoriaOpcion[];
  lineaInicial?: "INDUSTRIAL" | "CARGA_PESADA";
  categoriaIdInicial?: string;
};

export function CamposLineaCategoria({
  categorias,
  lineaInicial = "INDUSTRIAL",
  categoriaIdInicial = "",
}: Props) {
  const [linea, setLinea] = useState(lineaInicial);
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
          onChange={(e) =>
            setLinea(e.target.value as "INDUSTRIAL" | "CARGA_PESADA")
          }
          className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
        >
          <option value="INDUSTRIAL">Industrial</option>
          <option value="CARGA_PESADA">Carga Pesada</option>
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
