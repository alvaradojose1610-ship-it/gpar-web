"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { siguienteNumeroDocumento } from "@/lib/contador-documento";
import { prisma } from "@/lib/prisma";
import { requerirSesion } from "@/modulos/autenticacion/servicio-sesion";

const esquemaItem = z.object({
  codigo: z.string().trim().min(1).max(64),
  cantidad: z.number().int().positive().max(9999),
});

const esquemaCotizacionWeb = z.object({
  nombre: z.string().trim().min(2).max(120),
  contacto: z.string().trim().min(5).max(120),
  empresa: z.string().trim().max(160).optional().or(z.literal("")),
  detalle: z.string().trim().min(3).max(4000),
  items: z.array(esquemaItem).max(80).default([]),
});

export type ResultadoCotizacionWeb =
  | { ok: true; numero: string }
  | { ok: false; error: string };

function separarContacto(contacto: string): {
  telefono: string | null;
  correo: string | null;
} {
  if (contacto.includes("@")) {
    return { telefono: null, correo: contacto };
  }
  return { telefono: contacto, correo: null };
}

export async function accionCrearCotizacionWeb(
  entrada: unknown,
): Promise<ResultadoCotizacionWeb> {
  const parsed = esquemaCotizacionWeb.safeParse(entrada);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario e intenta de nuevo.",
    };
  }

  const datos = parsed.data;
  const { telefono, correo } = separarContacto(datos.contacto);

  try {
    const codigos = [...new Set(datos.items.map((i) => i.codigo))];
    const productos =
      codigos.length > 0
        ? await prisma.producto.findMany({
            where: { codigo: { in: codigos }, estado: "ACTIVO" },
            select: { id: true, codigo: true, nombre: true },
          })
        : [];
    const porCodigo = new Map(productos.map((p) => [p.codigo, p]));

    const numero = await siguienteNumeroDocumento("cotizacion", "COT");

    const detalles =
      datos.items.length > 0
        ? datos.items.map((item) => {
            const producto = porCodigo.get(item.codigo);
            return {
              productoId: producto?.id ?? null,
              codigo: item.codigo,
              nombre: producto?.nombre ?? item.codigo,
              cantidad: item.cantidad,
            };
          })
        : [
            {
              productoId: null,
              codigo: "CONSULTA",
              nombre: "Consulta sin lista de productos",
              cantidad: 1,
              notas: datos.detalle,
            },
          ];

    await prisma.cotizacion.create({
      data: {
        numero,
        origen: "WEB",
        estado: "RECIBIDA",
        nombreContacto: datos.nombre,
        telefono,
        correo,
        empresa: datos.empresa || null,
        mensaje: datos.detalle,
        detalles: {
          create: detalles.map((d) => ({
            productoId: d.productoId,
            codigo: d.codigo,
            nombre: d.nombre,
            cantidad: d.cantidad,
            notas: "notas" in d ? d.notas : null,
          })),
        },
      },
    });

    return { ok: true, numero };
  } catch (error) {
    console.error("accionCrearCotizacionWeb", error);
    return {
      ok: false,
      error:
        "No pudimos guardar la cotización en este momento. Usa WhatsApp o intenta más tarde.",
    };
  }
}

const estadosPermitidos = [
  "RECIBIDA",
  "EN_REVISION",
  "ENVIADA",
  "ACEPTADA",
  "RECHAZADA",
  "ANULADA",
] as const;

export async function accionActualizarEstadoCotizacion(formData: FormData) {
  const sesion = await requerirSesion("/panel/cotizaciones");
  const id = String(formData.get("id") ?? "");
  const estado = String(formData.get("estado") ?? "");

  if (
    !id ||
    !estadosPermitidos.includes(estado as (typeof estadosPermitidos)[number])
  ) {
    return;
  }

  await prisma.cotizacion.update({
    where: { id },
    data: {
      estado: estado as (typeof estadosPermitidos)[number],
      atendidaPorId: sesion.id,
    },
  });

  revalidatePath("/panel/cotizaciones");
  revalidatePath(`/panel/cotizaciones/${id}`);
}
