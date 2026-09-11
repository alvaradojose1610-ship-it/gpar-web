"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { obtenerOCrearCajaPrincipal } from "@/modulos/caja/servicio-caja";

const esquemaAbrir = z.object({
  montoApertura: z.coerce.number().nonnegative().max(99999999),
});

export async function accionAbrirCaja(formData: FormData) {
  const sesion = await requerirPermiso(CODIGOS_PERMISO.CAJA_EDITAR);

  const yaAbierta = await prisma.aperturaCaja.findFirst({
    where: { estado: "ABIERTA" },
  });
  if (yaAbierta) {
    redirect("/panel/caja?error=ya-abierta");
  }

  const parsed = esquemaAbrir.safeParse({
    montoApertura: formData.get("montoApertura"),
  });
  if (!parsed.success) {
    redirect("/panel/caja?error=monto");
  }

  const caja = await obtenerOCrearCajaPrincipal();

  await prisma.$transaction(async (tx) => {
    const aperturaNueva = await tx.aperturaCaja.create({
      data: {
        cajaId: caja.id,
        usuarioAperturaId: sesion.id,
        montoApertura: parsed.data.montoApertura,
        estado: "ABIERTA",
      },
    });

    await tx.movimientoCaja.create({
      data: {
        aperturaCajaId: aperturaNueva.id,
        usuarioId: sesion.id,
        tipo: "APERTURA",
        metodoPago: "EFECTIVO",
        monto: parsed.data.montoApertura,
        descripcion: "Apertura de caja",
      },
    });
  });

  revalidatePath("/panel/caja");
  revalidatePath("/panel/ventas");
  redirect("/panel/caja?ok=abierta");
}

const esquemaCerrar = z.object({
  montoCierre: z.coerce.number().nonnegative().max(99999999),
  observaciones: z.string().trim().max(500).optional(),
});

export async function accionCerrarCaja(formData: FormData) {
  const sesion = await requerirPermiso(CODIGOS_PERMISO.CAJA_EDITAR);

  const apertura = await prisma.aperturaCaja.findFirst({
    where: { estado: "ABIERTA" },
  });
  if (!apertura) {
    redirect("/panel/caja?error=sin-apertura");
  }

  const parsed = esquemaCerrar.safeParse({
    montoCierre: formData.get("montoCierre"),
    observaciones: String(formData.get("observaciones") ?? "") || undefined,
  });
  if (!parsed.success) {
    redirect("/panel/caja?error=monto");
  }

  await prisma.$transaction(async (tx) => {
    await tx.movimientoCaja.create({
      data: {
        aperturaCajaId: apertura.id,
        usuarioId: sesion.id,
        tipo: "CIERRE",
        metodoPago: "EFECTIVO",
        monto: parsed.data.montoCierre,
        descripcion: "Cierre de caja",
      },
    });

    await tx.aperturaCaja.update({
      where: { id: apertura.id },
      data: {
        estado: "CERRADA",
        montoCierre: parsed.data.montoCierre,
        usuarioCierreId: sesion.id,
        cerradaEn: new Date(),
        observaciones: parsed.data.observaciones ?? null,
      },
    });
  });

  revalidatePath("/panel/caja");
  revalidatePath("/panel/ventas");
  redirect("/panel/caja?ok=cerrada");
}
