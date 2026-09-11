import "server-only";

import type { MetodoPago, Prisma, TipoMovimientoCaja } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type Tx = Prisma.TransactionClient;

/** Registra egreso de anulación si la venta generó ingreso VENTA en caja. */
export async function registrarAnulacionVentaEnCaja(
  tx: Tx,
  opts: {
    aperturaCajaId: string | null;
    usuarioId: string;
    numeroVenta: string;
    monto: number;
  },
) {
  if (!opts.aperturaCajaId || opts.monto <= 0) return;

  const ventaCaja = await tx.movimientoCaja.findFirst({
    where: {
      aperturaCajaId: opts.aperturaCajaId,
      tipo: "VENTA",
      referencia: opts.numeroVenta,
    },
  });
  if (!ventaCaja) return;

  const yaAnulada = await tx.movimientoCaja.findFirst({
    where: {
      aperturaCajaId: opts.aperturaCajaId,
      tipo: "ANULACION_VENTA",
      referencia: opts.numeroVenta,
    },
  });
  if (yaAnulada) return;

  await tx.movimientoCaja.create({
    data: {
      aperturaCajaId: opts.aperturaCajaId,
      usuarioId: opts.usuarioId,
      tipo: "ANULACION_VENTA",
      metodoPago: ventaCaja.metodoPago,
      monto: opts.monto,
      referencia: opts.numeroVenta,
      descripcion: `Anulación venta ${opts.numeroVenta}`,
    },
  });
}

export async function registrarMovimientoCajaSiApertura(
  tx: Tx,
  opts: {
    aperturaCajaId: string;
    usuarioId: string;
    tipo: TipoMovimientoCaja;
    metodoPago?: MetodoPago | null;
    monto: number;
    referencia?: string | null;
    descripcion?: string | null;
  },
) {
  if (opts.monto <= 0) return;
  await tx.movimientoCaja.create({
    data: {
      aperturaCajaId: opts.aperturaCajaId,
      usuarioId: opts.usuarioId,
      tipo: opts.tipo,
      metodoPago: opts.metodoPago ?? null,
      monto: opts.monto,
      referencia: opts.referencia ?? null,
      descripcion: opts.descripcion ?? null,
    },
  });
}

export async function obtenerOCrearCajaPrincipal() {
  const sucursal = await prisma.sucursal.upsert({
    where: { codigo: "PRINCIPAL" },
    update: {},
    create: {
      codigo: "PRINCIPAL",
      nombre: "Sucursal principal",
      activa: true,
    },
  });

  const existente = await prisma.caja.findUnique({
    where: {
      sucursalId_codigo: {
        sucursalId: sucursal.id,
        codigo: "PRINCIPAL",
      },
    },
  });
  if (existente) return existente;

  return prisma.caja.create({
    data: {
      sucursalId: sucursal.id,
      codigo: "PRINCIPAL",
      nombre: "Caja principal",
      activa: true,
    },
  });
}

export async function obtenerAperturaAbierta() {
  return prisma.aperturaCaja.findFirst({
    where: { estado: "ABIERTA" },
    include: {
      caja: true,
      usuarioApertura: { select: { nombre: true, usuario: true } },
      movimientos: {
        orderBy: { creadoEn: "desc" },
        take: 20,
      },
    },
    orderBy: { abiertaEn: "desc" },
  });
}
