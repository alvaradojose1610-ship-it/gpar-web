import Link from "next/link";

import { FormularioNuevoApartado } from "@/componentes/panel/FormularioNuevoApartado";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string; codigo?: string; disp?: string }> };

export default async function PaginaNuevoApartado({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.APARTADOS_EDITAR, "/panel/apartados");
  const params = await searchParams;

  let error: string | null = null;
  if (params.error === "stock") {
    error = `Sin disponible${params.codigo ? ` para ${params.codigo}` : ""}${params.disp != null ? ` (${params.disp})` : ""}.`;
  } else if (params.error === "datos" || params.error === "lineas") {
    error = "Revisa los datos del apartado.";
  } else if (params.error === "producto") {
    error = "Algún producto no es válido.";
  }

  return (
    <PaginaPlaceholderPanel
      titulo="Nuevo apartado"
      descripcion="Reserva stock con vencimiento. No confundir con cotización web."
    >
      <p className="mb-4">
        <Link
          href="/panel/apartados"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Apartados
        </Link>
      </p>
      {error ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <FormularioNuevoApartado />
    </PaginaPlaceholderPanel>
  );
}
