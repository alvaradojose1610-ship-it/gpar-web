"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { siguienteNumeroDocumento } from "@/lib/contador-documento";
import { prisma } from "@/lib/prisma";
import { extraerTokenQrProducto } from "@/lib/qr-producto";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import {
  obtenerAperturaAbierta,
  registrarAnulacionVentaEnCaja,
} from "@/modulos/caja/servicio-caja";
import {
  obtenerAlmacenPrincipal,
  obtenerMapaStockDisponible,
  obtenerStockDisponible,
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
  condicionPago: z.enum(["CONTADO", "CREDITO"]).default("CONTADO"),
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
  await requerirPermiso(CODIGOS_PERMISO.VENTAS_CREAR);
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

  const stock = await obtenerStockDisponible(producto.id);

  return {
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    precioVenta: Number(producto.precioVenta),
    stock,
  };
}

export async function accionConfirmarVenta(formData: FormData) {
  const sesion = await requerirPermiso(CODIGOS_PERMISO.VENTAS_CREAR);

  let lineasRaw: unknown = [];
  try {
    lineasRaw = JSON.parse(String(formData.get("lineas") ?? "[]"));
  } catch {
    redirect("/panel/ventas/nueva?error=lineas");
  }

  const parsed = esquemaVenta.safeParse({
    nombreCliente: String(formData.get("nombreCliente") ?? "") || undefined,
    observaciones: String(formData.get("observaciones") ?? "") || undefined,
    condicionPago: String(formData.get("condicionPago") ?? "CONTADO"),
    lineas: lineasRaw,
  });

  if (!parsed.success) {
    redirect("/panel/ventas/nueva?error=datos");
  }

  const datos = parsed.data;
  const esCredito = datos.condicionPago === "CREDITO";
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

  const cotizacionId = String(formData.get("cotizacionId") ?? "").trim() || null;
  const apartadoId = String(formData.get("apartadoId") ?? "").trim() || null;

  // Stock disponible = físico − apartados activos (excluye el apartado en conversión)
  const stockMap = await obtenerMapaStockDisponible(ids, {
    excluirApartadoId: apartadoId ?? undefined,
  });
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

  if (cotizacionId) {
    const cot = await prisma.cotizacion.findUnique({
      where: { id: cotizacionId },
      select: { id: true, ventaId: true, estado: true },
    });
    if (!cot || cot.ventaId || cot.estado === "CONVERTIDA") {
      redirect("/panel/ventas/nueva?error=cotizacion");
    }
  }

  if (apartadoId) {
    const apa = await prisma.apartado.findUnique({
      where: { id: apartadoId },
      select: { id: true, estado: true, ventaId: true, vencimientoEn: true },
    });
    if (
      !apa ||
      apa.ventaId ||
      apa.estado !== "ACTIVO" ||
      apa.vencimientoEn <= new Date()
    ) {
      redirect("/panel/ventas/nueva?error=apartado");
    }
  }

  let ventaId = "";

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
        condicionPago: datos.condicionPago,
        observaciones: datos.observaciones ?? null,
      },
    });
    ventaId = venta.id;

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

    if (esCredito) {
      await tx.cuentaPorCobrar.create({
        data: {
          ventaId: venta.id,
          clienteId: clienteId,
          total,
          saldo: total,
          estado: "PENDIENTE",
        },
      });
    } else if (apertura) {
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

    if (cotizacionId) {
      await tx.cotizacion.update({
        where: { id: cotizacionId },
        data: {
          estado: "CONVERTIDA",
          ventaId: venta.id,
          atendidaPorId: sesion.id,
          clienteId: clienteId ?? undefined,
        },
      });
    }

    if (apartadoId) {
      await tx.apartado.update({
        where: { id: apartadoId },
        data: {
          estado: "CONVERTIDO",
          ventaId: venta.id,
          clienteId: clienteId ?? undefined,
        },
      });
    }
  });

  revalidatePath("/panel/ventas");
  revalidatePath("/panel/inventario");
  revalidatePath("/panel/caja");
  revalidatePath("/panel/cuentas-por-cobrar");
  redirect(`/panel/ventas/${ventaId}`);
}

export async function accionAnularVenta(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.VENTAS_CREAR,
    "/panel/ventas",
  );

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/ventas?error=datos");

  const venta = await prisma.venta.findUnique({
    where: { id },
    include: { detalles: true, cuentaPorCobrar: true },
  });
  if (!venta || venta.estadoDocumento !== "CONFIRMADA") {
    redirect("/panel/ventas?error=anular");
  }

  const almacen = await obtenerAlmacenPrincipal();
  if (!almacen) redirect("/panel/ventas?error=almacen");

  await prisma.$transaction(async (tx) => {
    await tx.venta.update({
      where: { id },
      data: { estadoDocumento: "ANULADA" },
    });

    for (const linea of venta.detalles) {
      await tx.movimientoInventario.create({
        data: {
          productoId: linea.productoId,
          almacenId: almacen.id,
          tipo: "ANULACION_VENTA",
          cantidad: linea.cantidad,
          referencia: venta.numero,
          observaciones: `Anulación venta ${venta.numero}`,
          usuarioId: sesion.id,
        },
      });
    }

    await registrarAnulacionVentaEnCaja(tx, {
      aperturaCajaId: venta.aperturaCajaId,
      usuarioId: sesion.id,
      numeroVenta: venta.numero,
      monto: Number(venta.total),
    });

    if (venta.cuentaPorCobrar && venta.cuentaPorCobrar.estado !== "ANULADA") {
      await tx.cuentaPorCobrar.update({
        where: { id: venta.cuentaPorCobrar.id },
        data: { estado: "ANULADA", saldo: 0 },
      });
    }

    await tx.cotizacion.updateMany({
      where: { ventaId: id },
      data: { estado: "ANULADA" },
    });
  });

  revalidatePath("/panel/ventas");
  revalidatePath(`/panel/ventas/${id}`);
  revalidatePath("/panel/inventario");
  revalidatePath("/panel/caja");
  revalidatePath("/panel/cuentas-por-cobrar");
  redirect(`/panel/ventas/${id}?ok=anulada`);
}
