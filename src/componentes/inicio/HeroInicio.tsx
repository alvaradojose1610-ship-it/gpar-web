"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categoriasPorLinea } from "@/datos/catalogo";

type Props = {
  titulo: string;
  subtitulo: string;
};

function clasesLineaTitulo(indice: number, total: number): string {
  if (total === 1) {
    return "text-[length:clamp(54px,6.8vw,128px)] font-extrabold";
  }
  if (indice === 0) {
    return "text-[length:clamp(40px,4.4vw,84px)] font-light tracking-[0.02em]";
  }
  if (indice === 1) {
    return "text-[length:clamp(54px,6.8vw,128px)] font-extrabold";
  }
  return "text-[length:clamp(36px,4.1vw,78px)] font-extrabold text-gpar-orange";
}

export function HeroInicio({ titulo, subtitulo }: Props) {
  const nombresStrip = categoriasPorLinea("industrial").map((c) => c.nombre);
  const stripDuplicado = [...nombresStrip, ...nombresStrip];
  const lineasTitulo = titulo
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  const videoFondoRef = useRef<HTMLVideoElement>(null);
  const videoPrincipalRef = useRef<HTMLVideoElement>(null);
  const [sonidoActivo, setSonidoActivo] = useState(false);
  const [reducirMovimiento, setReducirMovimiento] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const actualizar = () => setReducirMovimiento(media.matches);
    actualizar();
    media.addEventListener("change", actualizar);
    return () => media.removeEventListener("change", actualizar);
  }, []);

  useEffect(() => {
    if (reducirMovimiento) return;

    const fondo = videoFondoRef.current;
    const principal = videoPrincipalRef.current;
    if (!fondo || !principal) return;

    let cancelado = false;

    const silenciarFondo = () => {
      fondo.defaultMuted = true;
      fondo.muted = true;
      fondo.volume = 0;
    };

    const asegurarReproduccion = (
      video: HTMLVideoElement,
      conSonido = false,
    ) => {
      if (cancelado) return;
      video.defaultMuted = !conSonido;
      video.muted = !conSonido;
      if (!conSonido) video.volume = 0;

      const intentar = () => {
        if (cancelado) return;
        void video.play().catch(() => {});
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        intentar();
      } else {
        video.addEventListener("canplay", intentar, { once: true });
      }
    };

    silenciarFondo();
    const guardarFondoMudo = () => silenciarFondo();
    fondo.addEventListener("volumechange", guardarFondoMudo);
    asegurarReproduccion(fondo, false);

    const sincronizar = (activo: boolean) => {
      if (cancelado) return;
      silenciarFondo();
      principal.muted = !activo;
      principal.volume = activo ? 1 : 0;
      asegurarReproduccion(principal, activo);
      setSonidoActivo(activo);
    };

    // Autoplay fiable: siempre arrancar mudo; el sonido requiere gesto.
    sincronizar(false);

    const primerToque = (evento: PointerEvent) => {
      document.removeEventListener("pointerdown", primerToque, true);
      const destino = evento.target;
      if (
        destino instanceof Element &&
        destino.closest("button, a, input, textarea, select, label")
      ) {
        return;
      }
      if (principal.muted) sincronizar(true);
    };

    document.addEventListener("pointerdown", primerToque, true);
    return () => {
      cancelado = true;
      document.removeEventListener("pointerdown", primerToque, true);
      fondo.removeEventListener("volumechange", guardarFondoMudo);
      fondo.pause();
      principal.pause();
      silenciarFondo();
      principal.muted = true;
      principal.volume = 0;
    };
  }, [reducirMovimiento]);

  function alternarSonido() {
    const fondo = videoFondoRef.current;
    const principal = videoPrincipalRef.current;
    if (!principal) return;
    if (fondo) {
      fondo.muted = true;
      fondo.volume = 0;
    }
    const activar = principal.muted;
    principal.muted = !activar;
    principal.volume = activar ? 1 : 0;
    if (activar) void principal.play().catch(() => {});
    setSonidoActivo(activar);
  }

  return (
    <>
      <section className="relative h-auto overflow-hidden bg-[#07090C] min-[821px]:h-[clamp(560px,calc(100vh-130px),900px)]">
        {!reducirMovimiento ? (
          <video
            ref={videoFondoRef}
            className="pointer-events-none absolute inset-[-40px] h-[calc(100%+80px)] w-[calc(100%+80px)] object-cover brightness-[0.35] blur-[36px]"
            src="/video/hero-gpar.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 bg-[#07090C]" aria-hidden />
        )}

        <div className="relative mx-auto flex h-full max-w-[1680px] flex-col-reverse items-stretch gap-0 pl-0 min-[821px]:flex-row min-[821px]:items-center min-[821px]:gap-[clamp(24px,4vw,72px)] min-[821px]:pl-[clamp(20px,2.4vw,40px)]">
          <div className="flex min-w-0 flex-1 flex-col items-start px-5 py-10 text-white min-[821px]:px-0 min-[821px]:py-[clamp(40px,5vw,80px)]">
            <div className="flex items-center gap-4 font-display text-[length:clamp(15px,1.25vw,22px)] font-bold tracking-[0.32em] uppercase">
              <span className="h-[3px] w-[46px] bg-gpar-orange" aria-hidden />
              Soluciones para la industria
            </div>

            <h1 className="mt-[clamp(20px,2vw,34px)] flex flex-col font-display leading-[0.92] uppercase">
              {lineasTitulo.map((linea, indice) => (
                <span
                  key={`${indice}-${linea}`}
                  className={clasesLineaTitulo(indice, lineasTitulo.length)}
                >
                  {linea}
                </span>
              ))}
            </h1>

            <p className="mt-[clamp(22px,2.2vw,38px)] max-w-[44ch] text-[length:clamp(16px,1.3vw,23px)] leading-relaxed text-pretty">
              {subtitulo}
            </p>

            <div className="mt-[clamp(26px,2.4vw,42px)] flex flex-wrap gap-[18px]">
              <Link
                href="/cotizar"
                className="inline-flex items-center justify-center bg-gpar-orange px-[clamp(26px,2.2vw,42px)] py-[clamp(16px,1.2vw,22px)] text-[length:clamp(15px,1vw,19px)] font-bold tracking-[0.08em] whitespace-nowrap text-gpar-ink uppercase hover:bg-gpar-orange-ink"
              >
                Solicitar cotización
              </Link>
              <Link
                href="#catalogo"
                className="inline-flex items-center justify-center border-2 border-white px-[clamp(24px,2.1vw,40px)] py-[clamp(14px,1.1vw,20px)] text-[length:clamp(15px,1vw,19px)] font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase hover:bg-white hover:text-gpar-ink"
              >
                Ver el catálogo
              </Link>
            </div>
          </div>

          <div className="relative aspect-[9/16] w-full max-h-[80vh] shrink-0 border-b-4 border-gpar-orange min-[821px]:aspect-[9/8] min-[821px]:h-full min-[821px]:w-auto min-[821px]:max-h-none min-[821px]:border-b-0 min-[821px]:border-l-4">
            {!reducirMovimiento ? (
              <video
                ref={videoPrincipalRef}
                className="block h-full w-full bg-black object-cover"
                src="/video/hero-gpar.mp4"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
              />
            ) : (
              <div className="h-full w-full bg-black" aria-hidden />
            )}

            {!reducirMovimiento ? (
              <button
                type="button"
                className="absolute right-4 bottom-4 flex items-center gap-2.5 bg-white px-4 py-3 text-[15px] font-bold text-gpar-ink shadow-[0_4px_18px_rgba(0,0,0,0.4)]"
                aria-pressed={sonidoActivo}
                onClick={alternarSonido}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M4 9h4l5-4v14l-5-4H4z" />
                  {sonidoActivo ? (
                    <>
                      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
                      <path d="M18.5 6a8 8 0 0 1 0 12" />
                    </>
                  ) : (
                    <path d="M16.5 8.5a5 5 0 0 1 0 7" />
                  )}
                </svg>
                <span>{sonidoActivo ? "Silenciar" : "Activar sonido"}</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div
        className="relative overflow-hidden whitespace-nowrap border-y border-gpar-orange-edge bg-gpar-ink py-[22px]"
        aria-hidden="true"
      >
        <div
          data-strip
          className="inline-flex gap-6 font-display text-[21px] font-bold tracking-[0.05em] text-white uppercase"
          style={{ animation: "gp-strip var(--gp-strip-dur) linear infinite" }}
        >
          {stripDuplicado.map((nombre, i) => (
            <span key={`${nombre}-${i}`} className="inline-flex items-center gap-6">
              <span>{nombre}</span>
              <i className="not-italic text-gpar-orange-light">/</i>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
