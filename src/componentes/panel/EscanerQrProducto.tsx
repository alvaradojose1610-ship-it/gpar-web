"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";

import {
  detenerCamaraQr,
  iniciarCamaraQr,
  mensajeErrorCamaraQr,
} from "@/lib/escaner-qr-camara";

const DEDUP_MS = 1200;
const REGION_ID = "escaner-qr-producto-pos";

export type ResultadoEscaneoQr =
  | { ok: true; mensaje?: string }
  | { ok: false; error: string };

type Props = {
  onCodigo: (contenido: string) => Promise<ResultadoEscaneoQr>;
};

export function EscanerQrProducto({ onCodigo }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState(false);
  const [resolviendo, setResolviendo] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const ultimoRef = useRef<{ codigo: string; en: number } | null>(null);
  const procesandoRef = useRef(false);
  const onCodigoRef = useRef(onCodigo);

  useEffect(() => {
    onCodigoRef.current = onCodigo;
  }, [onCodigo]);

  const procesarCodigo = useCallback(async (contenido: string) => {
    const codigo = contenido.trim();
    if (!codigo || procesandoRef.current) return;

    const ahora = Date.now();
    const ult = ultimoRef.current;
    if (ult && ult.codigo === codigo && ahora - ult.en < DEDUP_MS) {
      return;
    }
    ultimoRef.current = { codigo, en: ahora };

    procesandoRef.current = true;
    setResolviendo(true);
    setError(null);
    try {
      const res = await onCodigoRef.current(codigo);
      if (!res.ok) {
        setError(res.error);
        return;
      }

      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        await detenerCamaraQr(scanner);
      }
      setAbierto(false);
    } catch {
      setError("No se pudo resolver el código QR.");
    } finally {
      procesandoRef.current = false;
      setResolviendo(false);
    }
  }, []);

  useEffect(() => {
    if (!abierto) return;

    let cancelado = false;

    if (typeof window !== "undefined" && !window.isSecureContext) {
      queueMicrotask(() => {
        if (!cancelado) {
          setErrorCamara(mensajeErrorCamaraQr(new Error("InsecureContext")));
          setIniciando(false);
        }
      });
      return () => {
        cancelado = true;
      };
    }

    async function iniciar() {
      try {
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        if (cancelado) return;

        const scanner = await iniciarCamaraQr({
          regionId: REGION_ID,
          onScan: (decodedText) => {
            void procesarCodigo(decodedText);
          },
        });
        if (cancelado) {
          await detenerCamaraQr(scanner);
          return;
        }
        scannerRef.current = scanner;
      } catch (err) {
        if (cancelado) return;
        setErrorCamara(mensajeErrorCamaraQr(err));
      } finally {
        if (!cancelado) setIniciando(false);
      }
    }

    void iniciar();

    return () => {
      cancelado = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        void detenerCamaraQr(scanner);
      }
    };
  }, [abierto, procesarCodigo]);

  function abrir() {
    setError(null);
    setErrorCamara(null);
    setIniciando(true);
    setResolviendo(false);
    procesandoRef.current = false;
    ultimoRef.current = null;
    setAbierto(true);
  }

  function cerrar() {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      void detenerCamaraQr(scanner);
    }
    setAbierto(false);
    setError(null);
    setErrorCamara(null);
    setResolviendo(false);
    setIniciando(false);
    procesandoRef.current = false;
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="min-h-10 border border-[#E4E7EC] bg-white px-3 text-sm font-semibold text-[#1D2430] hover:bg-[#F7F8FA]"
      >
        Escanear QR
      </button>

      {abierto ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-escaner-qr-producto"
        >
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden border border-[#E4E7EC] bg-white shadow-xl">
            <header className="flex items-center justify-between gap-2 border-b border-[#E4E7EC] px-4 py-3">
              <h3
                id="titulo-escaner-qr-producto"
                className="text-base font-semibold text-[#1D2430]"
              >
                Escanear producto
              </h3>
              <button
                type="button"
                onClick={cerrar}
                className="text-sm font-semibold text-[#D96A00] hover:underline"
              >
                Cerrar
              </button>
            </header>
            <div className="space-y-3 overflow-y-auto p-4">
              <p className="text-sm text-[#5C6675]">
                Apuntá al QR de la etiqueta del estante. Al leerlo se agrega al
                ticket y se cierra la cámara.
              </p>
              {iniciando && !errorCamara ? (
                <p className="text-sm text-[#8A94A2]">Solicitando cámara…</p>
              ) : null}
              {resolviendo ? (
                <p className="text-sm text-[#8A94A2]">Agregando al ticket…</p>
              ) : null}
              {errorCamara ? (
                <p className="text-sm text-red-700">{errorCamara}</p>
              ) : null}
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <div
                id={REGION_ID}
                className="min-h-[220px] overflow-hidden bg-black [&_video]:max-h-[55vh] [&_video]:w-full [&_video]:object-cover"
              />
              <button
                type="button"
                onClick={cerrar}
                className="inline-flex min-h-10 w-full items-center justify-center border border-[#E4E7EC] bg-[#F7F8FA] px-4 text-sm font-semibold text-[#1D2430] hover:bg-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
