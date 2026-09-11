import "server-only";

import { Prisma, type TipoMovimientoInventario } from "@prisma/client";

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
  movimientos: {
    tipo: TipoMovimientoInventario;
    cantidad: { toString(): string } | number;
  }[],
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
  const mapa = await obtenerMapaStock([productoId]);
  return mapa.get(productoId) ?? 0;
}

/** Mapa productoId → stock para listados (1 query agregada). */
export async function obtenerMapaStock(
  productoIds: string[],
): Promise<Map<string, number>> {
  const mapa = new Map<string, number>();
  if (productoIds.length === 0) return mapa;

  for (const id of productoIds) {
    mapa.set(id, 0);
  }

  type Fila = { productoId: string; stock: Prisma.Decimal | number | string };

  const filas = await prisma.$queryRaw<Fila[]>`
    SELECT
      m."productoId" AS "productoId",
      COALESCE(
        SUM(
          CASE
            WHEN m.tipo::text IN ('ENTRADA_COMPRA', 'AJUSTE_ENTRADA', 'ANULACION_VENTA')
              THEN m.cantidad
            WHEN m.tipo::text IN ('SALIDA_VENTA', 'AJUSTE_SALIDA', 'ANULACION_COMPRA')
              THEN -m.cantidad
            ELSE 0
          END
        ),
        0
      ) AS stock
    FROM movimientos_inventario m
    WHERE m."productoId" IN (${Prisma.join(productoIds)})
    GROUP BY m."productoId"
  `;

  for (const fila of filas) {
    mapa.set(fila.productoId, Number(fila.stock));
  }

  return mapa;
}

export async function obtenerAlmacenPrincipal() {
  return prisma.almacen.findUnique({ where: { codigo: "PRINCIPAL" } });
}
