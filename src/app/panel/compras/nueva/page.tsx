import Link from "next/link";

import { FormularioNuevaCompra } from "@/componentes/panel/FormularioNuevaCompra";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const mensajesError: Record<string, string> = {
  datos: "Revisa proveedor y líneas de la compra.",
  lineas: "Las líneas de la compra no son válidas.",
  almacen: "No existe el almacén PRINCIPAL. Ejecuta el seed.",
  proveedor: "Proveedor no válido.",
  producto: "Algún producto de la lista no es válido.",
};

export default async function PaginaNuevaCompra({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.COMPRAS_EDITAR, "/panel/compras");
  const params = await searchParams;

  const proveedores = await prisma.proveedor.findMany({
    where: { estado: "ACTIVO" },
    orderBy: { razonSocial: "asc" },
    select: { id: true, razonSocial: true },
  });

  const mensajeError = params.error
    ? (mensajesError[params.error] ?? "No se pudo confirmar la compra.")
    : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Nueva compra"
      descripcion="Confirma la compra para entrar stock al almacén principal."
    >
      <p className="mb-4">
        <Link
          href="/panel/compras"
          className="text-sm font-semibold text-[#D96A00] hover:underline"
        >
          ← Volver
        </Link>
      </p>

      {proveedores.length === 0 ? (
        <p className="mb-4 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Necesitas al menos un{" "}
          <Link href="/panel/proveedores/nuevo" className="font-semibold underline">
            proveedor
          </Link>{" "}
          antes de registrar una compra.
        </p>
      ) : null}

      {mensajeError ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {mensajeError}
        </p>
      ) : null}

      <FormularioNuevaCompra proveedores={proveedores} />
    </PaginaPlaceholderPanel>
  );
}
