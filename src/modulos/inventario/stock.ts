import "server-only";

import type { TipoMovimientoInventario } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const TIPOS_ENTRADA: TipoMovimientoInventario[] = [
  "ENTRADA_COMPRA",
  "AJUSTE_ENTRADA",
  "ANULACION_VENTA",
];

const TIPOS_SALIDA: TipoMovimientoInventario[] = [
  "SALIDA_VENTA",
  "AJUSTE_SALIDA",
  "ANULACION_COMPRA",
];

export function esEntradaInventario(tipo: TipoMovimientoInventario): boolean {
  return TIPOS_ENTRADA.includes(tipo);
}

export function esSalidaInventario(tipo: TipoMovimientoInventario): boolean {
  return TIPOS_SALIDA.includes(tipo);
}

/** Stock = sum(entradas) − sum(salidas) de MovimientoInventario. */
export function calcularStockDesdeMovimientos(
  movimientos: { tipo: TipoMovimientoInventario; cantidad: { toString(): string } | number }[],
): number {
  let stock = 0;
  for (const m of movimientos) {
    const cantidad = Number(m.cantidad);
    if (esEntradaInventario(m.tipo)) stock += cantidad;
    else if (esSalidaInventario(m.tipo)) stock -= cantidad;
  }
  return stock;
}

export async function obtenerStockProducto(productoId: string): Promise<number> {
  const movimientos = await prisma.movimientoInventario.findMany({
    where: { productoId },
    select: { tipo: true, cantidad: true },
  });
  return calcularStockDesdeMovimientos(movimientos);
}

/** Mapa productoId → stock para listados. */
export async function obtenerMapaStock(
  productoIds: string[],
): Promise<Map<string, number>> {
  const mapa = new Map<string, number>();
  if (productoIds.length === 0) return mapa;

  for (const id of productoIds) {
    mapa.set(id, 0);
  }

  const movimientos = await prisma.movimientoInventario.findMany({
    where: { productoId: { in: productoIds } },
    select: { productoId: true, tipo: true, cantidad: true },
  });

  for (const m of movimientos) {
    const actual = mapa.get(m.productoId) ?? 0;
    const cantidad = Number(m.cantidad);
    if (esEntradaInventario(m.tipo)) mapa.set(m.productoId, actual + cantidad);
    else if (esSalidaInventario(m.tipo)) mapa.set(m.productoId, actual - cantidad);
  }

  return mapa;
}

export async function obtenerAlmacenPrincipal() {
  return prisma.almacen.findUnique({ where: { codigo: "PRINCIPAL" } });
}
