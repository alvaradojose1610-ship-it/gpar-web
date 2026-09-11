import "server-only";

import { prisma } from "@/lib/prisma";

/** Obtiene el siguiente número de documento (ej. COT-000001). */
export async function siguienteNumeroDocumento(
  idContador: string,
  prefijo: string,
): Promise<string> {
  const fila = await prisma.$transaction(async (tx) => {
    const actual = await tx.contadorDocumento.upsert({
      where: { id: idContador },
      create: { id: idContador, ultimoNumero: 1 },
      update: { ultimoNumero: { increment: 1 } },
    });
    return actual.ultimoNumero;
  });

  return `${prefijo}-${String(fila).padStart(6, "0")}`;
}
