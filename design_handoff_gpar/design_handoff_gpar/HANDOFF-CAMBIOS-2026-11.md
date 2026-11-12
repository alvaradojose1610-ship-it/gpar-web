# Cambios — noviembre 2026 (aprobados por el cliente)

Prevalecen sobre `DESIGN_HANDOFF.md` y `reference/home.html` donde haya conflicto.

## 1. Header (`SiteHeader`)
- Logo: `assets/logo-header.png`, circular, tamaño `clamp(66px, 5.4vw, 104px)`.
- Header más alto; padding `clamp(14px,1.3vw,22px) clamp(20px,2.4vw,40px)`, contenedor `max-width: 1680px`.
- Barra superior de 4px `#A3245E` encima del header.
- Buscador, nav y botón "Mi cotización" escalan con `clamp()`; valores exactos en `reference/inicio-v3-hero-video.dc.html.txt`.

## 2. Hero (`Hero`) — ahora con video
- Fragmento listo: `components/03-hero.html` (HTML + CSS + JS vanilla, portar a componente cliente React).
- Video: `assets/video/hero-gpar.mp4` (vertical 9:16, con audio). Copiar a `public/video/hero-gpar.mp4`.
- Layout desktop: texto a la izquierda; video completo 9:16 a la derecha a toda la altura del hero, borde izquierdo 4px `#F57C00`. Fondo: el mismo video con `blur(36px) brightness(.35)`.
- Copy final: kicker "Soluciones para la industria" · H1 "Todo en / Transmisión / de potencia mecánica" (se eliminó "en un solo lugar") · CTA "Solicitar cotización" + "Ver el catálogo". Se quitaron los chips.
- Altura: `clamp(560px, calc(100vh - 130px), 900px)`.

### Sonido (importante)
Los navegadores **no permiten autoplay con audio**. Comportamiento:
1. Intentar `play()` con sonido.
2. Si falla → reproducir en mute.
3. Activar sonido en el primer `pointerdown` del usuario (fuera de botones) o con el botón "Activar sonido / Silenciar" (`aria-pressed`).

En React: `useRef` para el `<video>`, `useEffect` para el intento inicial y el listener, `'use client'`.

### Recomendaciones de producción
- Generar `poster` (primer frame en JPG/WebP) para mostrar mientras carga.
- Versión WebM opcional + MP4 como fallback.
- Mobile (≤820px): video arriba a ancho completo, texto debajo. **Pendiente de validar con el cliente.**
- Respetar `prefers-reduced-motion`: no autoplay, mostrar poster.

## Archivos nuevos
    assets/video/hero-gpar.mp4
    assets/logo-header.png
    components/03-hero.html                      (reescrito)
    reference/inicio-v3-hero-video.dc.html.txt   (diseño aprobado, solo referencia)
