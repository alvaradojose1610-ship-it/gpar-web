import "server-only";

import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";

import {
  ANCHO_IMAGEN_PRODUCTO,
  ANCHO_THUMB_PRODUCTO,
  MAX_IMAGEN_PRODUCTO_BYTES,
} from "@/lib/imagen-producto-constantes";

export { MAX_IMAGEN_PRODUCTO_BYTES };

const TIPOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ImagenProductoSubida = {
  url: string;
  thumbUrl: string;
};

type VariantesImagen = {
  principal: Buffer;
  thumb: Buffer;
  contentType: string;
  extension: string;
};

function tokenBlob() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

function extensionDe(archivo: File) {
  const porMime = TIPOS[archivo.type];
  if (porMime) return porMime;
  if (/\.jpe?g$/i.test(archivo.name)) return "jpg";
  if (/\.png$/i.test(archivo.name)) return "png";
  if (/\.webp$/i.test(archivo.name)) return "webp";
  return null;
}

export function esUrlBlobImagen(imagenUrl?: string | null) {
  return !!imagenUrl && imagenUrl.includes(".blob.vercel-storage.com");
}

/**
 * Import dinámico: no cargar sharp al abrir formularios de editar/nuevo.
 * sharp@0.35 + Next 16.2/Turbopack en Vercel omite libvips y tumba la ruta entera.
 */
async function comprimirVariantes(
  buffer: Buffer,
  extensionOrigen: string,
): Promise<VariantesImagen> {
  try {
    const { default: sharp } = await import("sharp");
    const base = sharp(buffer).rotate();

    const [principal, thumb] = await Promise.all([
      base
        .clone()
        .resize({
          width: ANCHO_IMAGEN_PRODUCTO,
          height: ANCHO_IMAGEN_PRODUCTO,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 78 })
        .toBuffer(),
      base
        .clone()
        .resize({
          width: ANCHO_THUMB_PRODUCTO,
          height: ANCHO_THUMB_PRODUCTO,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 70 })
        .toBuffer(),
    ]);

    return {
      principal,
      thumb,
      contentType: "image/webp",
      extension: "webp",
    };
  } catch (error) {
    console.error(
      "[imagen-producto] sharp no disponible; se sube la imagen ya comprimida en el cliente.",
      error,
    );
    const contentType =
      extensionOrigen === "png"
        ? "image/png"
        : extensionOrigen === "webp"
          ? "image/webp"
          : "image/jpeg";
    return {
      principal: buffer,
      thumb: buffer,
      contentType,
      extension: extensionOrigen,
    };
  }
}

/** Sube `imagen` del FormData a Vercel Blob (WebP + thumb). Sin archivo → null. */
export async function guardarImagenProducto(
  formData: FormData,
  entidadId?: string,
  opciones?: { carpeta?: "productos" | "categorias"; campo?: string },
): Promise<ImagenProductoSubida | null> {
  const campo = opciones?.campo ?? "imagen";
  const carpeta = opciones?.carpeta ?? "productos";
  const archivo = formData.get(campo);
  if (!(archivo instanceof File) || archivo.size === 0) return null;

  const extension = extensionDe(archivo);
  if (!extension) {
    if (
      archivo.type === "image/heic" ||
      archivo.type === "image/heif" ||
      /\.(heic|heif)$/i.test(archivo.name)
    ) {
      throw new Error(
        "HEIC/HEIF no es compatible. En el iPhone usá «Más compatible» (JPG) o compartí como JPG.",
      );
    }
    throw new Error("La imagen debe ser JPG, PNG o WebP.");
  }
  if (archivo.size > MAX_IMAGEN_PRODUCTO_BYTES) {
    throw new Error("La imagen no puede superar 1.5 MB.");
  }

  const token = tokenBlob();
  if (!token) {
    throw new Error(
      "Falta BLOB_READ_WRITE_TOKEN en el entorno (Vercel Blob).",
    );
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const variantes = await comprimirVariantes(buffer, extension);

  const id = randomUUID();
  const prefijo = entidadId
    ? `gpar/${carpeta}/${entidadId}`
    : `gpar/${carpeta}`;
  const keyPrincipal = `${prefijo}/${id}.${variantes.extension}`;
  const keyThumb = `${prefijo}/${id}-thumb.${variantes.extension}`;

  const [blob, blobThumb] = await Promise.all([
    put(keyPrincipal, variantes.principal, {
      access: "public",
      contentType: variantes.contentType,
      token,
    }),
    put(keyThumb, variantes.thumb, {
      access: "public",
      contentType: variantes.contentType,
      token,
    }),
  ]);

  return { url: blob.url, thumbUrl: blobThumb.url };
}

export async function eliminarImagenProducto(imagenUrl?: string | null) {
  if (!esUrlBlobImagen(imagenUrl)) return;
  const token = tokenBlob();
  if (!token || !imagenUrl) return;
  try {
    await del(imagenUrl, { token });
  } catch {
    // no bloquear si el blob ya no existe
  }
}

export async function eliminarImagenesProducto(
  ...urls: (string | null | undefined)[]
) {
  await Promise.all(urls.map((url) => eliminarImagenProducto(url)));
}
