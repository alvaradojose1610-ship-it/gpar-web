import "server-only";

import { prisma } from "@/lib/prisma";

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
