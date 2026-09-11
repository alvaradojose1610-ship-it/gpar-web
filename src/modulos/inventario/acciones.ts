"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import {
  obtenerAlmacenPrincipal,
  obtenerStockProducto,
} from "@/modulos/inventario/stock";

const esquema = z.object({
  productoId: z.string().min(1),
  tipo: z.enum(["AJUSTE_ENTRADA", "AJUSTE_SALIDA"]),
  cantidad: z.coerce.number().positive().max(999999),
  observaciones: z.string().trim().max(500).optional(),
});

export async function accionRegistrarAjusteInventario(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.INVENTARIO_EDITAR,
    "/panel/inventario",
  );

  const parsed = esquema.safeParse({
    productoId: formData.get("productoId"),
    tipo: formData.get("tipo"),
    cantidad: formData.get("cantidad"),
    observaciones: String(formData.get("observaciones") ?? "") || undefined,
  });

  if (!parsed.success) {
    const pid = String(formData.get("productoId") ?? "");
    redirect(
      pid
        ? `/panel/inventario/${pid}?error=datos`
        : "/panel/inventario?error=datos",
    );
  }

  const datos = parsed.data;
  const almacen = await obtenerAlmacenPrincipal();
  if (!almacen) {
    redirect(`/panel/inventario/${datos.productoId}?error=almacen`);
  }

  const producto = await prisma.producto.findFirst({
    where: { id: datos.productoId, estado: "ACTIVO" },
  });
  if (!producto) {
    redirect("/panel/inventario?error=producto");
  }

  if (datos.tipo === "AJUSTE_SALIDA") {
    const stock = await obtenerStockProducto(datos.productoId);
    if (datos.cantidad > stock) {
      redirect(
        `/panel/inventario/${datos.productoId}?error=stock&disp=${stock}`,
      );
    }
  }

  await prisma.movimientoInventario.create({
    data: {
      productoId: datos.productoId,
      almacenId: almacen.id,
      tipo: datos.tipo,
      cantidad: datos.cantidad,
      observaciones:
        datos.observaciones ??
        (datos.tipo === "AJUSTE_ENTRADA"
          ? "Ajuste de entrada"
          : "Ajuste de salida"),
      usuarioId: sesion.id,
      referencia: "AJUSTE",
    },
  });

  revalidatePath("/panel/inventario");
  revalidatePath(`/panel/inventario/${datos.productoId}`);
  redirect(`/panel/inventario/${datos.productoId}?ok=ajuste`);
}
