# Handoff: Catálogo web Distribuidora GPar

## Qué es esto

Paquete de diseño para reconstruir el catálogo de **Distribuidora GPar** en **Next.js (App Router) + React + Tailwind**.

GPar distribuye **dos líneas**: repuestos **industriales** (B2B: plantas, talleres, mantenimiento) y repuestos **automotrices** (talleres y público general). El sitio no es una tienda con carrito y pago: el usuario arma una lista de referencias y el CTA principal en toda la experiencia es **Solicitar cotización**.

## Sobre los archivos de este paquete

Los HTML/CSS incluidos son **referencias de diseño**, no código de producción. Muestran la apariencia y el comportamiento previstos. La tarea es **recrear estos diseños en el codebase destino** (Next.js App Router, React, Tailwind) con sus patrones y librerías; no copiar los archivos tal cual.

## Fidelidad

**Alta fidelidad (hi-fi).** Colores, tipografía, espaciados, textos y estados son finales, salvo lo listado en § Placeholders. Reproducir pixel a pixel.

## Contenido del paquete

    design_handoff_gpar/
    ├── README.md                     ← este archivo
    ├── DESIGN_HANDOFF.md             ← especificación completa (leer primero)
    ├── tokens/
    │   ├── tokens.css                ← variables CSS — fuente de verdad
    │   └── tokens.json               ← los mismos tokens en JSON (para Tailwind/Style Dictionary)
    ├── reference/
    │   ├── home.html                 ← home completa, standalone, mobile-first
    │   ├── categoria.html            ← página de categoría con filtros y barra flotante
    │   ├── styles.css                ← hoja de referencia usada por ambas páginas
    │   └── prototipo-original...txt  ← prototipo original, solo como referencia de comportamiento
    ├── components/                   ← 15 fragmentos HTML, uno por sección (+ su propio README)
    ├── data/
    │   └── catalogo.json             ← 15 categorías industriales, 84 referencias, con specs
    └── assets/
        ├── logo-gpar.png             ← logo real de GPar
        ├── icons/                    ← 17 íconos SVG (trazo 1.8, currentColor)
        └── IMAGES.md                 ← inventario de imágenes + lista de lo que falta

Abrir `reference/home.html` en el navegador (con la carpeta completa, porque enlaza `../tokens/tokens.css`).

## Orden de secciones — Home

| # | Sección | Componente sugerido | Notas |
|---|---|---|---|
| 1 | Franja superior naranja | `TopBar` | Oculta bajo 768px |
| 2 | Header sticky (logo, buscador, nav, "Mi cotización") | `SiteHeader` | Cliente |
| 3 | Hero con foto + CTA "Solicitar cotización" | `Hero` | |
| 4 | Marquesina de categorías | `CategoryStrip` | Decorativa, `aria-hidden` |
| 5 | ¿Cómo podemos ayudarte? (4 accesos) | `HelpCards` | |
| 6 | Conmutador Industrial / Automotriz + grilla de categorías | `LineSwitch` + `CategoryGrid` | Estado en la URL |
| 7 | Banda CTA "¿No sabes el código del repuesto?" | `CtaBand` | |
| 8 | Productos destacados (8) | `ProductGrid` | |
| 9 | Marcas | `BrandRow` | **Placeholder** |
| 10 | ¿Por qué comprar en GPar? (4 razones) | `Reasons` | |
| 11 | Solicita tu cotización (datos + formulario) | `QuoteForm` | Cliente |
| 12 | Footer | `SiteFooter` | |

Superpuestos: `QuoteDrawer` (panel lateral, z 90) y `MobileActionBar` (barra flotante, z 55, solo con ítems en la lista).

## Orden de secciones — Página de categoría (`/[linea]/[categoria]`)

1. Breadcrumb · 2. Encabezado (kicker, H1, descripción, "← Volver al inicio") · 3. Barra de subfiltros sticky con contador · 4. Grilla de productos · 5. Barra flotante inferior · 6. Footer.

`/buscar?q=` usa la misma plantilla sin subfiltros y con estado vacío "Sin resultados".

## Rutas sugeridas

    /                          home
    /industrial                grilla de categorías industriales
    /industrial/[categoria]    productos de la categoría (?sub= filtro)
    /automotriz                línea automotriz (hoy: categorías "Próximamente")
    /buscar?q=                 resultados
    /cotizar                   formulario de cotización

## Placeholders — nada de esto es definitivo

| Qué | Estado |
|---|---|
| **Teléfono, WhatsApp, correo, dirección, horario** | "Por confirmar" en todo el paquete. **No inventar.** |
| **Años de trayectoria, cantidad de clientes, cualquier cifra de la empresa** | No existen en el diseño. No agregarlos sin dato real. |
| **Marcas** | La sección muestra "Marca 1…5". Confirmar con GPar cuáles puede exhibir y con qué logotipos autorizados. En `data/catalogo.json` algunos ítems traen marca a modo de ejemplo técnico: verificar antes de publicar. |
| **Códigos `GP-*`** | Códigos internos inventados para el prototipo. Sustituir por los reales del inventario. |
| **Precios** | Ocultos por defecto (`Precio a consultar`). El diseño soporta mostrarlos si GPar lo decide. |
| **Fotografía** | Toda de Unsplash. Ver `assets/IMAGES.md` § 3 para la lista de lo que hay que pedir. |
| **Línea automotriz** | Las 10 categorías son una propuesta. Sin surtido cargado; se muestran como "Próximamente". |
| **Stock "Disponible"** | Etiqueta fija en el prototipo. Debe venir del inventario o retirarse. |

## Por dónde empezar

1. Leer `DESIGN_HANDOFF.md` completo.
2. Copiar `tokens/tokens.css` a `app/globals.css` y mapear el tema en `tailwind.config.ts` (§ 11 del handoff).
3. Cargar las fuentes con `next/font/google`: Barlow Condensed (600/700/800), IBM Plex Sans (400/500/600/700), IBM Plex Mono (400/500).
4. Maquetar de abajo hacia arriba: `ProductCard` y `CategoryCard` primero, luego las páginas.
5. Estado de la lista de cotización en un contexto de cliente + `localStorage` (`gpar:cotizacion`); todo lo demás en la URL.
6. Revisar § 12 Accesibilidad: en el prototipo hay `<span onClick>` que **no** deben replicarse.
