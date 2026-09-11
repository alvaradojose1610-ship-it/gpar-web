import { MAX_IMAGEN_PRODUCTO_BYTES } from "@/lib/imagen-producto-constantes";

const TARGET_IMAGE_BYTES = 900 * 1024;
const MAX_IMAGE_SIDE = 1200;
const MIN_QUALITY = 0.55;

export function mensajeErrorCargaImagen(archivo: File) {
  if (
    archivo.type === "image/heic" ||
    archivo.type === "image/heif" ||
    /\.(heic|heif)$/i.test(archivo.name)
  ) {
    return "El formato HEIC/HEIF del iPhone no es compatible. En Ajustes → Cámara → Formatos elige «Más compatible», o comparte la foto como JPG.";
  }
  return "No se pudo leer la imagen. Usa JPG, PNG o WebP.";
}

function tipoEfectivo(archivo: File): "image/jpeg" | "image/png" | "image/webp" | null {
  if (
    archivo.type === "image/jpeg" ||
    archivo.type === "image/png" ||
    archivo.type === "image/webp"
  ) {
    return archivo.type;
  }
  if (/\.jpe?g$/i.test(archivo.name)) return "image/jpeg";
  if (/\.png$/i.test(archivo.name)) return "image/png";
  if (/\.webp$/i.test(archivo.name)) return "image/webp";
  return null;
}

function cargarImagen(archivo: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(archivo);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(mensajeErrorCargaImagen(archivo)));
    };
    image.src = url;
  });
}

function canvasABlob(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png" | "image/webp",
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("No se pudo comprimir la imagen."));
      },
      type,
      quality,
    );
  });
}

async function comprimirRaster(
  archivo: File,
  type: "image/jpeg" | "image/png" | "image/webp",
) {
  const image = await cargarImagen(archivo);
  const scale = Math.min(
    1,
    MAX_IMAGE_SIDE / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No se pudo comprimir la imagen.");
  }

  if (type === "image/png" || type === "image/webp") {
    context.clearRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);

  const baseName = archivo.name.replace(/\.[^.]+$/, "") || "producto";

  if (type === "image/png") {
    const blob = await canvasABlob(canvas, "image/png");
    if (blob.size > MAX_IMAGEN_PRODUCTO_BYTES) {
      throw new Error(
        "La imagen PNG sigue siendo muy pesada. Reduce el tamaño o usa JPG.",
      );
    }
    return new File([blob], `${baseName}.png`, {
      type: "image/png",
      lastModified: Date.now(),
    });
  }

  if (type === "image/webp") {
    let quality = 0.82;
    let blob = await canvasABlob(canvas, "image/webp", quality);
    while (blob.size > TARGET_IMAGE_BYTES && quality > MIN_QUALITY) {
      quality -= 0.08;
      blob = await canvasABlob(canvas, "image/webp", quality);
    }
    if (blob.size > MAX_IMAGEN_PRODUCTO_BYTES) {
      throw new Error(
        "La imagen sigue siendo muy pesada. Recórtala o usa menor resolución.",
      );
    }
    return new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  }

  let quality = 0.82;
  let blob = await canvasABlob(canvas, "image/jpeg", quality);
  while (blob.size > TARGET_IMAGE_BYTES && quality > MIN_QUALITY) {
    quality -= 0.08;
    blob = await canvasABlob(canvas, "image/jpeg", quality);
  }
  if (blob.size > MAX_IMAGEN_PRODUCTO_BYTES) {
    throw new Error(
      "La imagen sigue siendo muy pesada. Recórtala o usa menor resolución.",
    );
  }
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

/** Comprime en el navegador antes de enviar (fotos de celular suelen superar 1.5 MB). */
export async function comprimirImagenCliente(archivo: File) {
  const tipo = tipoEfectivo(archivo);
  if (!tipo) {
    throw new Error(mensajeErrorCargaImagen(archivo));
  }

  if (archivo.size <= TARGET_IMAGE_BYTES && tipo === "image/jpeg") {
    return archivo;
  }
  if (tipo === "image/png" && archivo.size <= MAX_IMAGEN_PRODUCTO_BYTES) {
    return archivo;
  }
  if (tipo === "image/webp" && archivo.size <= TARGET_IMAGE_BYTES) {
    return archivo;
  }

  return comprimirRaster(archivo, tipo);
}
