import Link from "next/link";

import { FormularioPos } from "@/componentes/panel/FormularioPos";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { obtenerAperturaAbierta } from "@/modulos/caja/servicio-caja";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    error?: string;
    codigo?: string;
    disp?: string;
  }>;
};

export default async function PaginaNuevaVenta({ searchParams }: Props) {
  await requerirSesion();
  const params = await searchParams;
  const apertura = await obtenerAperturaAbierta();

  let mensajeError: string | null = null;
  if (params.error === "stock") {
    mensajeError = `Stock insuficiente${params.codigo ? ` para ${params.codigo}` : ""}${params.disp != null ? ` (disponible: ${params.disp})` : ""}.`;
  } else if (params.error === "datos") {
    mensajeError = "Revisa los datos de la venta.";
  } else if (params.error === "lineas") {
    mensajeError = "Las líneas no son válidas.";
  } else if (params.error === "almacen") {
    mensajeError = "No existe el almacén PRINCIPAL. Ejecuta el seed.";
  } else if (params.error === "producto") {
    mensajeError = "Algún producto no es válido.";
  }

  return (
    <PaginaPlaceholderPanel
      titulo="Punto de venta"
      descripcion="Busca por código, agrega líneas y confirma. Se bloquea si no hay stock."
    >
      <p className="mb-4 flex flex-wrap gap-4">
        <Link
          href="/panel/ventas"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Ventas
        </Link>
        <Link
          href="/panel/caja"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          Caja
        </Link>
      </p>

      {mensajeError ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {mensajeError}
        </p>
      ) : null}

      <FormularioPos tieneCajaAbierta={Boolean(apertura)} />
    </PaginaPlaceholderPanel>
  );
}
