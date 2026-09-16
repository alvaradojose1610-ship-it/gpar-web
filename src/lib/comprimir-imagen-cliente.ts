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
    return "El formato HEIC/HEIF del iPhone no es compatible. En Ajustes → Cámara → Formatos elige «Más compatible», o usá «Elegir de galería» con una foto JPG.";
  }
  return "No se pudo leer la imagen. Probá de nuevo o elegí JPG/PNG desde la galería.";
}

function esHeic(archivo: File) {
  return (
    archivo.type === "image/heic" ||
    archivo.type === "image/heif" ||
    /\.(heic|heif)$/i.test(archivo.name)
  );
}

/**
 * Cámara móvil a veces manda type vacío o image/jpg.
 * Si no es HEIC y hay bytes, asumimos JPEG.
 */
function tipoEfectivo(
  archivo: File,
): "image/jpeg" | "image/png" | "image/webp" | null {
  if (esHeic(archivo)) return null;

  const type = (archivo.type || "").toLowerCase().trim();
  if (type === "image/jpeg" || type === "image/jpg") return "image/jpeg";
  if (type === "image/png") return "image/png";
  if (type === "image/webp") return "image/webp";

  if (/\.jpe?g$/i.test(archivo.name)) return "image/jpeg";
  if (/\.png$/i.test(archivo.name)) return "image/png";
  if (/\.webp$/i.test(archivo.name)) return "image/webp";

  // Captura de cámara: a menudo name="" y type=""
  if (archivo.size > 0 && (!type || type === "application/octet-stream")) {
    return "image/jpeg";
  }

  return null;
}

type FuenteDibujo = CanvasImageSource & {
  width: number;
  height: number;
  close?: () => void;
};

async function cargarFuente(archivo: File): Promise<FuenteDibujo> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(archivo);
      return bitmap;
    } catch {
      // cae al <img>
    }
  }

  return new Promise<FuenteDibujo>((resolve, reject) => {
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

function dimensionesSalida(ancho: number, alto: number) {
  const lado = Math.max(ancho, alto);
  const scale = lado > MAX_IMAGE_SIDE ? MAX_IMAGE_SIDE / lado : 1;
  return {
    width: Math.max(1, Math.round(ancho * scale)),
    height: Math.max(1, Math.round(alto * scale)),
  };
}

async function comprimirRaster(
  archivo: File,
  type: "image/jpeg" | "image/png" | "image/webp",
) {
  const fuente = await cargarFuente(archivo);
  try {
    const origenAncho =
      "naturalWidth" in fuente &&
      typeof (fuente as HTMLImageElement).naturalWidth === "number" &&
      (fuente as HTMLImageElement).naturalWidth > 0
        ? (fuente as HTMLImageElement).naturalWidth
        : fuente.width;
    const origenAlto =
      "naturalHeight" in fuente &&
      typeof (fuente as HTMLImageElement).naturalHeight === "number" &&
      (fuente as HTMLImageElement).naturalHeight > 0
        ? (fuente as HTMLImageElement).naturalHeight
        : fuente.height;
    const { width, height } = dimensionesSalida(origenAncho, origenAlto);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("No se pudo comprimir la imagen.");
    }

    // Fondo blanco: evita transparencia negra al pasar PNG/HEIC→JPG
    if (type === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    } else {
      context.clearRect(0, 0, width, height);
    }
    context.drawImage(fuente, 0, 0, width, height);

    const baseName =
      archivo.name.replace(/\.[^.]+$/, "").replace(/[^\w\-]+/g, "") ||
      "producto";

    if (type === "image/png") {
      const blob = await canvasABlob(canvas, "image/png");
      if (blob.size > MAX_IMAGEN_PRODUCTO_BYTES) {
        // PNG de cámara muy pesado → forzar JPG
        return comprimirComoJpeg(canvas, baseName);
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
        return comprimirComoJpeg(canvas, baseName);
      }
      return new File([blob], `${baseName}.webp`, {
        type: "image/webp",
        lastModified: Date.now(),
      });
    }

    return comprimirComoJpeg(canvas, baseName);
  } finally {
    fuente.close?.();
  }
}

async function comprimirComoJpeg(canvas: HTMLCanvasElement, baseName: string) {
  let quality = 0.82;
  let blob = await canvasABlob(canvas, "image/jpeg", quality);
  while (blob.size > TARGET_IMAGE_BYTES && quality > MIN_QUALITY) {
    quality -= 0.08;
    blob = await canvasABlob(canvas, "image/jpeg", quality);
  }
  if (blob.size > MAX_IMAGEN_PRODUCTO_BYTES) {
    throw new Error(
      "La imagen sigue siendo muy pesada. Acercá un poco menos o usá menor resolución.",
    );
  }
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

/**
 * Comprime en el navegador antes de enviar (fotos de celular suelen superar 1.5 MB).
 * Cámara: type vacío / JPG enorme → se normaliza a JPEG ≤ ~900 KB.
 */
export async function comprimirImagenCliente(archivo: File) {
  if (esHeic(archivo)) {
    throw new Error(mensajeErrorCargaImagen(archivo));
  }

  const tipo = tipoEfectivo(archivo);
  if (!tipo) {
    throw new Error(mensajeErrorCargaImagen(archivo));
  }

  // Siempre re-encodear capturas grandes o sin tipo claro (cámara).
  const pareceCaptura =
    !archivo.name ||
    /^image\.(jpe?g|png|webp)$/i.test(archivo.name) ||
    !(archivo.type || "").trim();

  if (
    !pareceCaptura &&
    archivo.size <= TARGET_IMAGE_BYTES &&
    tipo === "image/jpeg"
  ) {
    return archivo;
  }
  if (
    !pareceCaptura &&
    tipo === "image/png" &&
    archivo.size <= MAX_IMAGEN_PRODUCTO_BYTES
  ) {
    return archivo;
  }
  if (
    !pareceCaptura &&
    tipo === "image/webp" &&
    archivo.size <= TARGET_IMAGE_BYTES
  ) {
    return archivo;
  }

  try {
    // Cámara → siempre salir en JPEG (más compatible al subir).
    return await comprimirRaster(
      archivo,
      pareceCaptura ? "image/jpeg" : tipo,
    );
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(mensajeErrorCargaImagen(archivo));
  }
}
