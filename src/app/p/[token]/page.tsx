import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BotonAgregarCotizacion } from "@/componentes/catalogo/BotonAgregarCotizacion";
import { Contenedor } from "@/componentes/interfaz/Contenedor";
import { productosCatalogo } from "@/datos/catalogo";
import { empresa } from "@/configuracion/empresa";

type Props = {
  params: Promise<{ token: string }>;
};

async function resolverProducto(token: string) {
  const desdeCatalogo = productosCatalogo.find(
    (p) => p.codigo.toLowerCase() === token.toLowerCase() || p.id === token,
  );

  try {
    const { prisma } = await import("@/lib/prisma");
    const desdeBd = await prisma.producto.findFirst({
      where: {
        OR: [{ tokenPublico: token }, { codigo: token }],
        estado: "ACTIVO",
      },
      include: { categoria: true, marca: true },
    });
    if (desdeBd) {
      return {
        codigo: desdeBd.codigo,
        nombre: desdeBd.nombre,
        descripcion: desdeBd.descripcion ?? "",
        aplicacion: desdeBd.aplicacion,
        linea: desdeBd.linea === "AUTOMOTRIZ" ? "automotriz" : "industrial",
        categoria: desdeBd.categoria.nombre,
        marca: desdeBd.marca?.nombre ?? null,
        tamano: desdeBd.tamano,
      };
    }
  } catch {
    // Sin BD: usar catálogo local
  }

  if (!desdeCatalogo) return null;

  return {
    codigo: desdeCatalogo.codigo,
    nombre: desdeCatalogo.nombre,
    descripcion: desdeCatalogo.descripcion,
    aplicacion: desdeCatalogo.aplicacion ?? null,
    linea: desdeCatalogo.linea,
    categoria: desdeCatalogo.categoriaId,
    marca: desdeCatalogo.marca ?? null,
    tamano: "tamano" in desdeCatalogo ? (desdeCatalogo.tamano ?? null) : null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const producto = await resolverProducto(token);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: `${producto.nombre} · ${producto.codigo}`,
    description: producto.descripcion || producto.aplicacion || undefined,
  };
}

export default async function PaginaFichaQr({ params }: Props) {
  const { token } = await params;
  const producto = await resolverProducto(token);
  if (!producto) notFound();

  const whatsapp = empresa.contacto.whatsapp;
  const textoWa = encodeURIComponent(
    `Hola GPar, consulto el repuesto ${producto.nombre} (${producto.codigo}).`,
  );

  return (
    <main className="min-h-full bg-gpar-bg">
      <div className="border-b border-gpar-line bg-gpar-orange">
        <Contenedor className="flex h-10 items-center justify-between text-sm font-semibold text-gpar-ink">
          <Link href="/" className="hover:underline">
            Distribuidora GPar
          </Link>
          <span className="font-mono text-xs uppercase tracking-wider">
            Ficha de estante
          </span>
        </Contenedor>
      </div>

      <Contenedor className="py-8 md:py-12">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-gpar-ink-3">
          {producto.linea} · {producto.categoria}
        </p>
        <p className="mt-3 font-mono text-sm text-gpar-ink-3">{producto.codigo}</p>
        <h1 className="mt-1 font-display text-[clamp(28px,4vw,40px)] font-extrabold uppercase leading-tight tracking-[0.02em] text-gpar-ink">
          {producto.nombre}
        </h1>
        {producto.descripcion ? (
          <p className="mt-3 max-w-xl text-gpar-ink-2">{producto.descripcion}</p>
        ) : null}
        {producto.aplicacion ? (
          <p className="mt-2 max-w-xl text-sm text-gpar-ink-2">
            <span className="font-semibold text-gpar-ink">Aplicación: </span>
            {producto.aplicacion}
          </p>
        ) : null}
        {producto.marca || producto.tamano ? (
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {producto.marca ? (
              <li className="border border-gpar-line bg-gpar-surface px-3 py-1.5 text-gpar-ink-2">
                Marca: {producto.marca}
              </li>
            ) : null}
            {producto.tamano ? (
              <li className="border border-gpar-line bg-gpar-surface px-3 py-1.5 text-gpar-ink-2">
                Tamaño: {producto.tamano}
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <BotonAgregarCotizacion
            codigo={producto.codigo}
            nombre={producto.nombre}
          />
          {whatsapp.disponible && whatsapp.href ? (
            <a
              href={`${whatsapp.href}?text=${textoWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center border border-gpar-ink bg-gpar-bg px-6 text-sm font-semibold text-gpar-ink hover:bg-gpar-ink hover:text-white"
            >
              Consultar por WhatsApp
            </a>
          ) : null}
        </div>
      </Contenedor>
    </main>
  );
}
