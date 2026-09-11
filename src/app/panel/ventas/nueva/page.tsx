import Link from "next/link";

import { FormularioPos } from "@/componentes/panel/FormularioPos";
import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { obtenerAperturaAbierta } from "@/modulos/caja/servicio-caja";
import { obtenerMapaStockDisponible } from "@/modulos/inventario/stock";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    error?: string;
    codigo?: string;
    disp?: string;
    cotizacionId?: string;
    apartadoId?: string;
  }>;
};

export default async function PaginaNuevaVenta({ searchParams }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.VENTAS_CREAR, "/panel/ventas");
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
  } else if (params.error === "cotizacion") {
    mensajeError = "La cotización ya fue convertida o no es válida.";
  } else if (params.error === "apartado") {
    mensajeError = "El apartado no está activo o ya venció.";
  }

  let cotizacionId: string | undefined;
  let apartadoId: string | undefined;
  let nombreClienteInicial = "";
  const lineasIniciales: Array<{
    productoId: string;
    codigo: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    stock: number;
  }> = [];

  if (params.cotizacionId) {
    const cotizacion = await prisma.cotizacion.findUnique({
      where: { id: params.cotizacionId },
      include: {
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                codigo: true,
                nombre: true,
                precioVenta: true,
                estado: true,
              },
            },
          },
        },
      },
    });

    if (
      cotizacion &&
      !cotizacion.ventaId &&
      cotizacion.estado !== "CONVERTIDA" &&
      cotizacion.estado !== "ANULADA"
    ) {
      cotizacionId = cotizacion.id;
      nombreClienteInicial = cotizacion.nombreContacto;

      const productoIds = cotizacion.detalles
        .map((d) => d.productoId ?? d.producto?.id)
        .filter((id): id is string => Boolean(id));

      const stockMap = await obtenerMapaStockDisponible(productoIds);

      for (const d of cotizacion.detalles) {
        const producto = d.producto;
        if (!producto || producto.estado !== "ACTIVO") continue;
        lineasIniciales.push({
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          cantidad: Number(d.cantidad),
          precioUnitario: Number(
            d.precioUnitario ?? producto.precioVenta ?? 0,
          ),
          stock: stockMap.get(producto.id) ?? 0,
        });
      }
    }
  }

  if (params.apartadoId) {
    const apartado = await prisma.apartado.findUnique({
      where: { id: params.apartadoId },
      include: {
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                codigo: true,
                nombre: true,
                precioVenta: true,
                estado: true,
              },
            },
          },
        },
      },
    });

    if (
      apartado &&
      apartado.estado === "ACTIVO" &&
      !apartado.ventaId &&
      apartado.vencimientoEn > new Date()
    ) {
      apartadoId = apartado.id;
      nombreClienteInicial = apartado.nombreContacto;
      const productoIds = apartado.detalles.map((d) => d.productoId);
      // Incluir la propia reserva del apartado en el stock mostrado
      const stockMap = await obtenerMapaStockDisponible(productoIds);
      // Al convertir, esta línea del apartado deja de reservarse; sumamos su cantidad al disponible mostrado.
      for (const d of apartado.detalles) {
        const producto = d.producto;
        if (!producto || producto.estado !== "ACTIVO") continue;
        const disponible =
          (stockMap.get(producto.id) ?? 0) + Number(d.cantidad);
        lineasIniciales.push({
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          cantidad: Number(d.cantidad),
          precioUnitario: Number(
            d.precioUnitario ?? producto.precioVenta ?? 0,
          ),
          stock: disponible,
        });
      }
    }
  }

  return (
    <PaginaPlaceholderPanel
      titulo="Punto de venta"
      descripcion="Busca por código, escanea el QR del estante, agrega líneas y confirma. Se bloquea si no hay stock."
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

      <FormularioPos
        tieneCajaAbierta={Boolean(apertura)}
        cotizacionId={cotizacionId}
        apartadoId={apartadoId}
        nombreClienteInicial={nombreClienteInicial}
        lineasIniciales={lineasIniciales}
      />
    </PaginaPlaceholderPanel>
  );
}
