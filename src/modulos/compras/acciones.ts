"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { siguienteNumeroDocumento } from "@/lib/contador-documento";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";
import { obtenerAlmacenPrincipal } from "@/modulos/inventario/stock";

const esquemaLinea = z.object({
  productoId: z.string().min(1),
  codigo: z.string().min(1),
  cantidad: z.number().positive().max(999999),
  costoUnitario: z.number().nonnegative().max(99999999),
});

const esquemaCompra = z.object({
  proveedorId: z.string().min(1),
  observaciones: z.string().trim().max(1000).optional(),
  condicionPago: z.enum(["CONTADO", "CREDITO"]).default("CONTADO"),
  lineas: z.array(esquemaLinea).min(1).max(200),
});

export type ProductoBusqueda = {
  id: string;
  codigo: string;
  nombre: string;
  precioCosto: number;
};

export async function buscarProductoParaCompra(
  codigo: string,
): Promise<ProductoBusqueda | null> {
  await requerirPermiso(CODIGOS_PERMISO.COMPRAS_EDITAR);
  const limpio = codigo.trim().toUpperCase();
  if (!limpio) return null;

  const producto = await prisma.producto.findFirst({
    where: { codigo: limpio, estado: "ACTIVO" },
    select: { id: true, codigo: true, nombre: true, precioCosto: true },
  });
  if (!producto) return null;

  return {
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    precioCosto: Number(producto.precioCosto),
  };
}

export async function accionConfirmarCompra(formData: FormData) {
  const sesion = await requerirPermiso(CODIGOS_PERMISO.COMPRAS_EDITAR);

  let lineasRaw: unknown = [];
  try {
    lineasRaw = JSON.parse(String(formData.get("lineas") ?? "[]"));
  } catch {
    redirect("/panel/compras/nueva?error=lineas");
  }

  const parsed = esquemaCompra.safeParse({
    proveedorId: formData.get("proveedorId"),
    observaciones: String(formData.get("observaciones") ?? "") || undefined,
    condicionPago: String(formData.get("condicionPago") ?? "CONTADO"),
    lineas: lineasRaw,
  });

  if (!parsed.success) {
    redirect("/panel/compras/nueva?error=datos");
  }

  const datos = parsed.data;
  const esCredito = datos.condicionPago === "CREDITO";
  const almacen = await obtenerAlmacenPrincipal();
  if (!almacen) {
    redirect("/panel/compras/nueva?error=almacen");
  }

  const proveedor = await prisma.proveedor.findFirst({
    where: { id: datos.proveedorId, estado: "ACTIVO" },
  });
  if (!proveedor) {
    redirect("/panel/compras/nueva?error=proveedor");
  }

  const ids = [...new Set(datos.lineas.map((l) => l.productoId))];
  const productos = await prisma.producto.findMany({
    where: { id: { in: ids }, estado: "ACTIVO" },
    select: { id: true },
  });
  if (productos.length !== ids.length) {
    redirect("/panel/compras/nueva?error=producto");
  }

  const subtotal = datos.lineas.reduce(
    (acc, l) => acc + l.cantidad * l.costoUnitario,
    0,
  );
  const total = Math.round(subtotal * 100) / 100;

  const numero = await siguienteNumeroDocumento("compra", "COM");

  let compraId = "";

  await prisma.$transaction(async (tx) => {
    const compra = await tx.compra.create({
      data: {
        numero,
        proveedorId: datos.proveedorId,
        fecha: new Date(),
        subtotal: total,
        descuento: 0,
        impuesto: 0,
        total,
        estadoDocumento: "CONFIRMADA",
        condicionPago: datos.condicionPago,
        observaciones: datos.observaciones ?? null,
        usuarioId: sesion.id,
      },
    });
    compraId = compra.id;

    for (const linea of datos.lineas) {
      const subtotalLinea =
        Math.round(linea.cantidad * linea.costoUnitario * 100) / 100;

      await tx.detalleCompra.create({
        data: {
          compraId: compra.id,
          productoId: linea.productoId,
          cantidad: linea.cantidad,
          costoUnitario: linea.costoUnitario,
          descuento: 0,
          subtotal: subtotalLinea,
        },
      });

      await tx.lote.create({
        data: {
          productoId: linea.productoId,
          proveedorId: datos.proveedorId,
          compraId: compra.id,
          almacenId: almacen.id,
          codigoLote: `${numero}-${linea.codigo}`,
          cantidad: linea.cantidad,
          costoUnitario: linea.costoUnitario,
        },
      });

      await tx.movimientoInventario.create({
        data: {
          productoId: linea.productoId,
          almacenId: almacen.id,
          tipo: "ENTRADA_COMPRA",
          cantidad: linea.cantidad,
          costoUnitario: linea.costoUnitario,
          referencia: numero,
          observaciones: `Compra ${numero}`,
          usuarioId: sesion.id,
        },
      });

      await tx.producto.update({
        where: { id: linea.productoId },
        data: { precioCosto: linea.costoUnitario },
      });
    }

    if (esCredito) {
      await tx.cuentaPorPagar.create({
        data: {
          compraId: compra.id,
          proveedorId: datos.proveedorId,
          total,
          saldo: total,
          estado: "PENDIENTE",
        },
      });
    }
  });

  revalidatePath("/panel/compras");
  revalidatePath("/panel/inventario");
  revalidatePath("/panel/productos");
  revalidatePath("/panel/cuentas-por-pagar");
  redirect(`/panel/compras/${compraId}`);
}

export async function accionAnularCompra(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.COMPRAS_EDITAR,
    "/panel/compras",
  );

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/compras?error=datos");

  const compra = await prisma.compra.findUnique({
    where: { id },
    include: { detalles: true, cuentaPorPagar: true },
  });
  if (!compra || compra.estadoDocumento !== "CONFIRMADA") {
    redirect("/panel/compras?error=anular");
  }

  const almacen = await obtenerAlmacenPrincipal();
  if (!almacen) redirect("/panel/compras?error=almacen");

  await prisma.$transaction(async (tx) => {
    await tx.compra.update({
      where: { id },
      data: { estadoDocumento: "ANULADA" },
    });

    for (const linea of compra.detalles) {
      await tx.movimientoInventario.create({
        data: {
          productoId: linea.productoId,
          almacenId: almacen.id,
          tipo: "ANULACION_COMPRA",
          cantidad: linea.cantidad,
          costoUnitario: linea.costoUnitario,
          referencia: compra.numero,
          observaciones: `Anulación compra ${compra.numero}`,
          usuarioId: sesion.id,
        },
      });
    }

    if (compra.cuentaPorPagar && compra.cuentaPorPagar.estado !== "ANULADA") {
      await tx.cuentaPorPagar.update({
        where: { id: compra.cuentaPorPagar.id },
        data: { estado: "ANULADA", saldo: 0 },
      });
    }
  });

  revalidatePath("/panel/compras");
  revalidatePath(`/panel/compras/${id}`);
  revalidatePath("/panel/inventario");
  revalidatePath("/panel/cuentas-por-pagar");
  redirect(`/panel/compras/${id}?ok=anulada`);
}
