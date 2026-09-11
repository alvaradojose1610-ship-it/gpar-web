import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

import { BotonImprimir } from "@/componentes/panel/BotonImprimir";
import { empresa } from "@/configuracion/empresa";
import { prisma } from "@/lib/prisma";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { requerirPermiso } from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({ where: { id } });
  return { title: producto ? `Etiqueta ${producto.codigo}` : "Etiqueta" };
}

export default async function PaginaEtiquetaProducto({ params }: Props) {
  await requerirPermiso(CODIGOS_PERMISO.PRODUCTOS_VER, "/panel/productos");
  const { id } = await params;

  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { categoria: true },
  });
  if (!producto) notFound();

  const urlPublica = `${empresa.urlSitio}/p/${producto.tokenPublico}`;
  const qrDataUrl = await QRCode.toDataURL(urlPublica, {
    margin: 1,
    width: 280,
    errorCorrectionLevel: "M",
  });

  return (
    <div className="min-h-full bg-white text-[#1D2430] print:bg-white">
      <div className="mx-auto max-w-md px-4 py-6 print:max-w-none print:p-0">
        <div className="mb-4 flex flex-wrap gap-4 print:hidden">
          <Link
            href="/panel/productos"
            className="text-sm font-semibold text-[#D96A00] hover:underline"
          >
            ← Productos
          </Link>
          <BotonImprimir />
        </div>

        <article className="border-2 border-[#1D2430] p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F57C00]">
            {empresa.nombreLegal}
          </p>
          <p className="mt-2 font-mono text-sm text-[#5C6675]">
            {producto.codigo}
          </p>
          <h1 className="mt-1 text-lg font-bold leading-tight">
            {producto.nombre}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wider text-[#8A94A2]">
            {producto.categoria.nombre}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt={`QR ${producto.codigo}`}
            className="mx-auto mt-4 h-48 w-48"
          />
          <p className="mt-2 break-all font-mono text-[10px] text-[#8A94A2]">
            {urlPublica}
          </p>
        </article>
      </div>
    </div>
  );
}
