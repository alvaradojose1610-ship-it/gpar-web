"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { siguienteNumeroDocumento } from "@/lib/contador-documento";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { obtenerMapaStockDisponible } from "@/modulos/inventario/stock";

const esquemaLinea = z.object({
  productoId: z.string().min(1),
  codigo: z.string().min(1),
  cantidad: z.number().positive().max(999999),
  precioUnitario: z.number().nonnegative().optional(),
});

const esquema = z.object({
  nombreContacto: z.string().trim().min(2).max(200),
  telefono: z.string().trim().max(40).optional(),
  diasVigencia: z.coerce.number().int().min(1).max(30).default(3),
  observaciones: z.string().trim().max(500).optional(),
  lineas: z.array(esquemaLinea).min(1).max(100),
});

export async function accionCrearApartado(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.APARTADOS_EDITAR,
    "/panel/apartados",
  );

  let lineasRaw: unknown = [];
  try {
    lineasRaw = JSON.parse(String(formData.get("lineas") ?? "[]"));
  } catch {
    redirect("/panel/apartados/nuevo?error=lineas");
  }

  const parsed = esquema.safeParse({
    nombreContacto: formData.get("nombreContacto"),
    telefono: String(formData.get("telefono") ?? "") || undefined,
    diasVigencia: formData.get("diasVigencia") || 3,
    observaciones: String(formData.get("observaciones") ?? "") || undefined,
    lineas: lineasRaw,
  });

  if (!parsed.success) {
    redirect("/panel/apartados/nuevo?error=datos");
  }

  const datos = parsed.data;
  const ids = [...new Set(datos.lineas.map((l) => l.productoId))];
  const productos = await prisma.producto.findMany({
    where: { id: { in: ids }, estado: "ACTIVO" },
    select: { id: true },
  });
  if (productos.length !== ids.length) {
    redirect("/panel/apartados/nuevo?error=producto");
  }

  const disponible = await obtenerMapaStockDisponible(ids);
  for (const linea of datos.lineas) {
    const disp = disponible.get(linea.productoId) ?? 0;
    if (linea.cantidad > disp) {
      redirect(
        `/panel/apartados/nuevo?error=stock&codigo=${encodeURIComponent(linea.codigo)}&disp=${disp}`,
      );
    }
  }

  const vencimientoEn = new Date();
  vencimientoEn.setDate(vencimientoEn.getDate() + datos.diasVigencia);
  const numero = await siguienteNumeroDocumento("apartado", "APA");

  await prisma.apartado.create({
    data: {
      numero,
      nombreContacto: datos.nombreContacto,
      telefono: datos.telefono ?? null,
      vencimientoEn,
      observaciones: datos.observaciones ?? null,
      usuarioId: sesion.id,
      estado: "ACTIVO",
      detalles: {
        create: datos.lineas.map((l) => ({
          productoId: l.productoId,
          cantidad: l.cantidad,
          precioUnitario: l.precioUnitario ?? null,
        })),
      },
    },
  });

  revalidatePath("/panel/apartados");
  revalidatePath("/panel/inventario");
  redirect("/panel/apartados?ok=creado");
}

export async function accionCancelarApartado(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.APARTADOS_EDITAR, "/panel/apartados");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/apartados?error=datos");

  const apartado = await prisma.apartado.findUnique({ where: { id } });
  if (!apartado || apartado.estado !== "ACTIVO") {
    redirect(`/panel/apartados/${id}?error=estado`);
  }

  await prisma.apartado.update({
    where: { id },
    data: { estado: "CANCELADO" },
  });

  revalidatePath("/panel/apartados");
  revalidatePath(`/panel/apartados/${id}`);
  revalidatePath("/panel/inventario");
  redirect(`/panel/apartados/${id}?ok=cancelado`);
}

/** Marca vencidos los apartados activos cuya fecha ya pasó. */
export async function vencerApartadosCaducados() {
  const ahora = new Date();
  await prisma.apartado.updateMany({
    where: { estado: "ACTIVO", vencimientoEn: { lte: ahora } },
    data: { estado: "VENCIDO" },
  });
}

export async function accionConvertirApartadoAVenta(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.APARTADOS_EDITAR, "/panel/apartados");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/apartados?error=datos");

  const apartado = await prisma.apartado.findUnique({ where: { id } });
  if (!apartado || apartado.estado !== "ACTIVO") {
    redirect(`/panel/apartados/${id}?error=estado`);
  }
  if (apartado.vencimientoEn <= new Date()) {
    await prisma.apartado.update({
      where: { id },
      data: { estado: "VENCIDO" },
    });
    redirect(`/panel/apartados/${id}?error=vencido`);
  }

  redirect(`/panel/ventas/nueva?apartadoId=${id}`);
}
