"use client";

import type { ChangeEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { comprimirImagenCliente } from "@/lib/comprimir-imagen-cliente";

type Props = {
  imagenUrlActual?: string | null;
  nombreProducto?: string;
  /** Nombre del checkbox oculto al marcar quitar (default: quitarImagen). */
  nombreQuitar?: string;
};

/**
 * Campo de foto con preview y compresión en el cliente (móvil / galería).
 */
export function CampoImagenProducto({
  imagenUrlActual,
  nombreProducto,
  nombreQuitar = "quitarImagen",
}: Props) {
  const baseId = useId();
  const galeriaId = `${baseId}-galeria`;
  const camaraId = `${baseId}-camara`;
  const inputEnvioRef = useRef<HTMLInputElement>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [eliminar, setEliminar] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const tieneActual = Boolean(imagenUrlActual) && !eliminar;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function limpiarPreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  async function procesarArchivo(archivo: File | undefined) {
    setMensaje(null);
    setError(null);
    setEliminar(false);
    limpiarPreview();

    if (!archivo) {
      if (inputEnvioRef.current) inputEnvioRef.current.value = "";
      return;
    }

    setProcesando(true);
    try {
      const comprimida = await comprimirImagenCliente(archivo);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(comprimida);
      if (inputEnvioRef.current) {
        inputEnvioRef.current.files = dataTransfer.files;
      }
      setPreviewUrl(URL.createObjectURL(comprimida));
      setMensaje(
        comprimida.size < archivo.size
          ? `Imagen optimizada: ${(comprimida.size / 1024).toFixed(0)} KB. Guarda para aplicar.`
          : `Imagen lista: ${(comprimida.size / 1024).toFixed(0)} KB. Guarda para aplicar.`,
      );
    } catch (caught) {
      if (inputEnvioRef.current) inputEnvioRef.current.value = "";
      setError(
        caught instanceof Error
          ? caught.message
          : "No se pudo preparar la imagen.",
      );
    } finally {
      setProcesando(false);
    }
  }

  async function alCambiar(event: ChangeEvent<HTMLInputElement>) {
    const archivo = event.currentTarget.files?.[0];
    await procesarArchivo(archivo);
    event.currentTarget.value = "";
  }

  function quitarSeleccion() {
    limpiarPreview();
    setMensaje(null);
    setError(null);
    if (inputEnvioRef.current) inputEnvioRef.current.value = "";
    setInputKey((k) => k + 1);
    if (imagenUrlActual) {
      setEliminar(true);
      setMensaje("La imagen se eliminará al guardar.");
    }
  }

  const srcPreview = previewUrl ?? (tieneActual ? imagenUrlActual : null);
  const etiquetaPreview = previewUrl
    ? "Nueva imagen"
    : tieneActual
      ? "Imagen actual"
      : null;

  return (
    <div className="grid gap-3 border border-[#E4E7EC] bg-[#F7F8FA] p-3">
      <div>
        <p className="text-sm font-semibold text-[#1D2430]">
          {tieneActual || previewUrl
            ? "Foto del producto"
            : "Foto del producto (opcional)"}
        </p>
        <p className="mt-1 text-xs text-[#8A94A2]">
          Tomá con el celular o elegí de la galería. JPG/PNG/WebP · se optimiza
          sola antes de subir (máx. 1.5 MB).
        </p>
      </div>

      {srcPreview ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="relative size-28 shrink-0 overflow-hidden border border-[#E4E7EC] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={srcPreview}
              alt={nombreProducto ?? "Vista previa del producto"}
              className="size-full object-cover"
            />
          </div>
          {etiquetaPreview ? (
            <p className="text-xs text-[#5C6675]">{etiquetaPreview}</p>
          ) : null}
        </div>
      ) : (
        <div
          className="flex size-28 items-center justify-center border border-dashed border-[#E4E7EC] bg-white text-xs font-medium uppercase tracking-wide text-[#98A2B3]"
          role="img"
          aria-label="Sin imagen"
        >
          Sin imagen
        </div>
      )}

      <input
        key={`envio-${inputKey}`}
        ref={inputEnvioRef}
        name="imagen"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />

      <input
        key={`galeria-${inputKey}`}
        id={galeriaId}
        type="file"
        accept="image/*"
        onChange={alCambiar}
        disabled={procesando}
        className="sr-only"
      />
      <input
        key={`camara-${inputKey}`}
        id={camaraId}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={alCambiar}
        disabled={procesando}
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={camaraId}
          className={`inline-flex min-h-11 cursor-pointer items-center justify-center bg-[#F57C00] px-4 text-sm font-bold text-[#1D2430] ${procesando ? "pointer-events-none opacity-60" : "hover:bg-[#D96A00]"}`}
        >
          Tomar foto
        </label>
        <label
          htmlFor={galeriaId}
          className={`inline-flex min-h-11 cursor-pointer items-center justify-center border border-[#E4E7EC] bg-white px-4 text-sm font-semibold text-[#1D2430] ${procesando ? "pointer-events-none opacity-60" : "hover:bg-[#F7F8FA]"}`}
        >
          Elegir de galería
        </label>
        {(tieneActual || previewUrl) && !procesando ? (
          <button
            type="button"
            onClick={quitarSeleccion}
            className="min-h-11 px-2 text-sm font-semibold text-red-700 hover:underline"
          >
            {previewUrl && !imagenUrlActual
              ? "Quitar selección"
              : "Quitar foto"}
          </button>
        ) : null}
      </div>

      {eliminar ? (
        <input type="hidden" name={nombreQuitar} value="on" />
      ) : null}

      {procesando ? (
        <p className="text-xs text-[#8A94A2]">Optimizando imagen…</p>
      ) : null}
      {mensaje ? (
        <p className="text-xs text-[#5C6675]">{mensaje}</p>
      ) : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
