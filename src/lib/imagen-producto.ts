import "server-only";

import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";

import { MAX_IMAGEN_PRODUCTO_BYTES } from "@/lib/imagen-producto-constantes";

export { MAX_IMAGEN_PRODUCTO_BYTES };

const TIPOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
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

/** Sube `imagen` del FormData a Vercel Blob. Sin archivo → null. */
export async function guardarImagenProducto(
  formData: FormData,
  productoId?: string,
): Promise<string | null> {
  const archivo = formData.get("imagen");
  if (!(archivo instanceof File) || archivo.size === 0) return null;

  const extension = extensionDe(archivo);
  if (!extension) {
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
  const key = productoId
    ? `gpar/productos/${productoId}/${randomUUID()}.${extension}`
    : `gpar/productos/${randomUUID()}.${extension}`;

  const blob = await put(key, buffer, {
    access: "public",
    contentType:
      extension === "jpg" ? "image/jpeg" : `image/${extension}`,
    token,
  });

  return blob.url;
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
