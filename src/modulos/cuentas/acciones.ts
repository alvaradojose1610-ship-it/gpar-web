"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import {
  obtenerAperturaAbierta,
  registrarAnulacionVentaEnCaja,
  registrarMovimientoCajaSiApertura,
} from "@/modulos/caja/servicio-caja";

export async function accionCrearCuentaPorCobrarDesdeVenta(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.CUENTAS_EDITAR,
    "/panel/cuentas-por-cobrar",
  );
  const ventaId = String(formData.get("ventaId") ?? "");
  if (!ventaId) redirect("/panel/cuentas-por-cobrar?error=datos");

  const venta = await prisma.venta.findUnique({
    where: { id: ventaId },
    include: { cuentaPorCobrar: true },
  });
  if (!venta || venta.estadoDocumento !== "CONFIRMADA" || venta.cuentaPorCobrar) {
    redirect(`/panel/ventas/${ventaId}?error=cxc`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.cuentaPorCobrar.create({
      data: {
        ventaId: venta.id,
        clienteId: venta.clienteId,
        total: venta.total,
        saldo: venta.total,
        estado: "PENDIENTE",
      },
    });
    await tx.venta.update({
      where: { id: venta.id },
      data: { condicionPago: "CREDITO" },
    });
    // Si la venta ya había entrado a caja como contado, revertir ese ingreso.
    await registrarAnulacionVentaEnCaja(tx, {
      aperturaCajaId: venta.aperturaCajaId,
      usuarioId: sesion.id,
      numeroVenta: venta.numero,
      monto: Number(venta.total),
    });
  });

  revalidatePath("/panel/cuentas-por-cobrar");
  revalidatePath(`/panel/ventas/${ventaId}`);
  revalidatePath("/panel/caja");
  redirect("/panel/cuentas-por-cobrar?ok=creada");
}

export async function accionCrearCuentaPorPagarDesdeCompra(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.CUENTAS_EDITAR, "/panel/cuentas-por-pagar");
  const compraId = String(formData.get("compraId") ?? "");
  if (!compraId) redirect("/panel/cuentas-por-pagar?error=datos");

  const compra = await prisma.compra.findUnique({
    where: { id: compraId },
    include: { cuentaPorPagar: true },
  });
  if (
    !compra ||
    compra.estadoDocumento !== "CONFIRMADA" ||
    compra.cuentaPorPagar
  ) {
    redirect(`/panel/compras/${compraId}?error=cxp`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.cuentaPorPagar.create({
      data: {
        compraId: compra.id,
        proveedorId: compra.proveedorId,
        total: compra.total,
        saldo: compra.total,
        estado: "PENDIENTE",
      },
    });
    await tx.compra.update({
      where: { id: compra.id },
      data: { condicionPago: "CREDITO" },
    });
  });

  revalidatePath("/panel/cuentas-por-pagar");
  revalidatePath(`/panel/compras/${compraId}`);
  redirect("/panel/cuentas-por-pagar?ok=creada");
}

const esquemaAbono = z.object({
  cuentaId: z.string().min(1),
  monto: z.coerce.number().positive(),
  metodoPago: z.enum([
    "EFECTIVO",
    "TRANSFERENCIA",
    "TARJETA",
    "PAGO_MOVIL",
    "OTRO",
  ]),
  referencia: z.string().trim().max(120).optional(),
});

export async function accionRegistrarAbonoCxC(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.CUENTAS_EDITAR,
    "/panel/cuentas-por-cobrar",
  );

  const parsed = esquemaAbono.safeParse({
    cuentaId: formData.get("cuentaId"),
    monto: formData.get("monto"),
    metodoPago: formData.get("metodoPago") || "EFECTIVO",
    referencia: String(formData.get("referencia") ?? "") || undefined,
  });
  if (!parsed.success) {
    redirect("/panel/cuentas-por-cobrar?error=datos");
  }

  const { cuentaId, monto, metodoPago, referencia } = parsed.data;
  const cuenta = await prisma.cuentaPorCobrar.findUnique({
    where: { id: cuentaId },
  });
  if (!cuenta || cuenta.estado === "ANULADA" || cuenta.estado === "PAGADA") {
    redirect(`/panel/cuentas-por-cobrar/${cuentaId}?error=estado`);
  }
  if (monto > Number(cuenta.saldo)) {
    redirect(`/panel/cuentas-por-cobrar/${cuentaId}?error=monto`);
  }

  const nuevoSaldo = Math.round((Number(cuenta.saldo) - monto) * 100) / 100;
  const apertura = await obtenerAperturaAbierta();

  await prisma.$transaction(async (tx) => {
    await tx.abonoCuentaPorCobrar.create({
      data: {
        cuentaPorCobrarId: cuentaId,
        monto,
        metodoPago,
        referencia: referencia ?? null,
      },
    });
    await tx.cuentaPorCobrar.update({
      where: { id: cuentaId },
      data: {
        saldo: nuevoSaldo,
        estado: nuevoSaldo <= 0 ? "PAGADA" : "PARCIAL",
      },
    });
    if (apertura && metodoPago !== "OTRO") {
      await registrarMovimientoCajaSiApertura(tx, {
        aperturaCajaId: apertura.id,
        usuarioId: sesion.id,
        tipo: "COBRO_CUENTA",
        metodoPago,
        monto,
        referencia: cuentaId,
        descripcion: `Abono CxC ${cuentaId.slice(0, 8)}`,
      });
    }
  });

  revalidatePath("/panel/cuentas-por-cobrar");
  revalidatePath(`/panel/cuentas-por-cobrar/${cuentaId}`);
  revalidatePath("/panel/caja");
  redirect(`/panel/cuentas-por-cobrar/${cuentaId}?ok=abono`);
}

export async function accionRegistrarPagoCxP(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.CUENTAS_EDITAR,
    "/panel/cuentas-por-pagar",
  );

  const parsed = esquemaAbono.safeParse({
    cuentaId: formData.get("cuentaId"),
    monto: formData.get("monto"),
    metodoPago: formData.get("metodoPago") || "EFECTIVO",
    referencia: String(formData.get("referencia") ?? "") || undefined,
  });
  if (!parsed.success) {
    redirect("/panel/cuentas-por-pagar?error=datos");
  }

  const { cuentaId, monto, metodoPago, referencia } = parsed.data;
  const cuenta = await prisma.cuentaPorPagar.findUnique({
    where: { id: cuentaId },
  });
  if (!cuenta || cuenta.estado === "ANULADA" || cuenta.estado === "PAGADA") {
    redirect(`/panel/cuentas-por-pagar/${cuentaId}?error=estado`);
  }
  if (monto > Number(cuenta.saldo)) {
    redirect(`/panel/cuentas-por-pagar/${cuentaId}?error=monto`);
  }

  const nuevoSaldo = Math.round((Number(cuenta.saldo) - monto) * 100) / 100;
  const apertura = await obtenerAperturaAbierta();
  await prisma.$transaction(async (tx) => {
    await tx.pagoCuentaPorPagar.create({
      data: {
        cuentaPorPagarId: cuentaId,
        monto,
        metodoPago,
        referencia: referencia ?? null,
      },
    });
    await tx.cuentaPorPagar.update({
      where: { id: cuentaId },
      data: {
        saldo: nuevoSaldo,
        estado: nuevoSaldo <= 0 ? "PAGADA" : "PARCIAL",
      },
    });
    if (apertura && metodoPago !== "OTRO") {
      await registrarMovimientoCajaSiApertura(tx, {
        aperturaCajaId: apertura.id,
        usuarioId: sesion.id,
        tipo: "PAGO_PROVEEDOR",
        metodoPago,
        monto,
        referencia: cuentaId,
        descripcion: `Pago CxP ${cuentaId.slice(0, 8)}`,
      });
    }
  });

  revalidatePath("/panel/cuentas-por-pagar");
  revalidatePath(`/panel/cuentas-por-pagar/${cuentaId}`);
  revalidatePath("/panel/caja");
  redirect(`/panel/cuentas-por-pagar/${cuentaId}?ok=pago`);
}
