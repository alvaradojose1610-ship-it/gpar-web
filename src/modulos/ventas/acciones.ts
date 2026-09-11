"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { siguienteNumeroDocumento } from "@/lib/contador-documento";
import { prisma } from "@/lib/prisma";
import { extraerTokenQrProducto } from "@/lib/qr-producto";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";
import { obtenerAperturaAbierta } from "@/modulos/caja/servicio-caja";
import {
  obtenerAlmacenPrincipal,
  obtenerMapaStock,
  obtenerStockProducto,
} from "@/modulos/inventario/stock";

const esquemaLinea = z.object({
  productoId: z.string().min(1),
  codigo: z.string().min(1),
  cantidad: z.number().positive().max(999999),
  precioUnitario: z.number().nonnegative().max(99999999),
});

const esquemaVenta = z.object({
  nombreCliente: z.string().trim().max(200).optional(),
  observaciones: z.string().trim().max(1000).optional(),
  lineas: z.array(esquemaLinea).min(1).max(200),
});

export type ProductoPos = {
  id: string;
  codigo: string;
  nombre: string;
  precioVenta: number;
  stock: number;
};

/**
 * Busca por código interno, URL de ficha `/p/<token>` o token público del QR.
 */
export async function buscarProductoParaVenta(
  entrada: string,
): Promise<ProductoPos | null> {
  await requerirSesion();
  const limpio = entrada.trim();
  if (!limpio) return null;

  const codigo = limpio.toUpperCase();
  const token = extraerTokenQrProducto(limpio);

  const producto = await prisma.producto.findFirst({
    where: {
      estado: "ACTIVO",
      OR: [
        { codigo },
        ...(token ? [{ tokenPublico: token }] : []),
      ],
    },
    select: {
      id: true,
      codigo: true,
      nombre: true,
      precioVenta: true,
    },
  });
  if (!producto) return null;

  const stock = await obtenerStockProducto(producto.id);

  return {
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    precioVenta: Number(producto.precioVenta),
    stock,
  };
}

export async function accionConfirmarVenta(formData: FormData) {
  const sesion = await requerirSesion();

  let lineasRaw: unknown = [];
  try {
    lineasRaw = JSON.parse(String(formData.get("lineas") ?? "[]"));
  } catch {
    redirect("/panel/ventas/nueva?error=lineas");
  }

  const parsed = esquemaVenta.safeParse({
    nombreCliente: String(formData.get("nombreCliente") ?? "") || undefined,
    observaciones: String(formData.get("observaciones") ?? "") || undefined,
    lineas: lineasRaw,
  });

  if (!parsed.success) {
    redirect("/panel/ventas/nueva?error=datos");
  }

  const datos = parsed.data;
  const almacen = await obtenerAlmacenPrincipal();
  if (!almacen) {
    redirect("/panel/ventas/nueva?error=almacen");
  }

  const ids = [...new Set(datos.lineas.map((l) => l.productoId))];
  const productos = await prisma.producto.findMany({
    where: { id: { in: ids }, estado: "ACTIVO" },
    select: { id: true },
  });
  if (productos.length !== ids.length) {
    redirect("/panel/ventas/nueva?error=producto");
  }

  // Una sola query de stock para todas las líneas (evita N+1)
  const stockMap = await obtenerMapaStock(ids);
  const cantidadPorProducto = new Map<string, number>();
  for (const linea of datos.lineas) {
    cantidadPorProducto.set(
      linea.productoId,
      (cantidadPorProducto.get(linea.productoId) ?? 0) + linea.cantidad,
    );
  }
  for (const linea of datos.lineas) {
    const stock = stockMap.get(linea.productoId) ?? 0;
    const requerido = cantidadPorProducto.get(linea.productoId) ?? linea.cantidad;
    if (stock < requerido) {
      redirect(
        `/panel/ventas/nueva?error=stock&codigo=${encodeURIComponent(linea.codigo)}&disp=${stock}`,
      );
    }
  }

  const subtotal = datos.lineas.reduce(
    (acc, l) => acc + l.cantidad * l.precioUnitario,
    0,
  );
  const total = Math.round(subtotal * 100) / 100;

  let clienteId: string | null = null;
  if (datos.nombreCliente) {
    const existente = await prisma.cliente.findFirst({
      where: {
        nombre: { equals: datos.nombreCliente, mode: "insensitive" },
        estado: "ACTIVO",
      },
    });
    if (existente) {
      clienteId = existente.id;
    } else {
      const creado = await prisma.cliente.create({
        data: {
          nombre: datos.nombreCliente,
          estado: "ACTIVO",
        },
      });
      clienteId = creado.id;
    }
  }

  const apertura = await obtenerAperturaAbierta();
  const numero = await siguienteNumeroDocumento("venta", "VEN");

  await prisma.$transaction(async (tx) => {
    const venta = await tx.venta.create({
      data: {
        numero,
        clienteId,
        aperturaCajaId: apertura?.id ?? null,
        usuarioId: sesion.id,
        fecha: new Date(),
        subtotal: total,
        descuento: 0,
        impuesto: 0,
        total,
        estadoDocumento: "CONFIRMADA",
        condicionPago: "CONTADO",
        observaciones: datos.observaciones ?? null,
      },
    });

    for (const linea of datos.lineas) {
      const subtotalLinea =
        Math.round(linea.cantidad * linea.precioUnitario * 100) / 100;

      await tx.detalleVenta.create({
        data: {
          ventaId: venta.id,
          productoId: linea.productoId,
          cantidad: linea.cantidad,
          precioUnitario: linea.precioUnitario,
          descuento: 0,
          subtotal: subtotalLinea,
        },
      });

      await tx.movimientoInventario.create({
        data: {
          productoId: linea.productoId,
          almacenId: almacen.id,
          tipo: "SALIDA_VENTA",
          cantidad: linea.cantidad,
          costoUnitario: null,
          referencia: numero,
          observaciones: `Venta ${numero}`,
          usuarioId: sesion.id,
        },
      });
    }

    if (apertura) {
      await tx.movimientoCaja.create({
        data: {
          aperturaCajaId: apertura.id,
          usuarioId: sesion.id,
          tipo: "VENTA",
          metodoPago: "EFECTIVO",
          monto: total,
          referencia: numero,
          descripcion: `Venta ${numero}`,
        },
      });
    }
  });

  revalidatePath("/panel/ventas");
  revalidatePath("/panel/inventario");
  revalidatePath("/panel/caja");
  redirect("/panel/ventas");
}
