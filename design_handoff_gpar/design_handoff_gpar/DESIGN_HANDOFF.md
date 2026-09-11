# DESIGN_HANDOFF — Distribuidora GPar

Rediseño del catálogo web. Documento de especificación visual y funcional para portar a **Next.js (App Router) + React + Tailwind**.
Todo el texto de interfaz va en **español latinoamericano (Venezuela)**, tono directo de mostrador, frases cortas.

---

## 1. Filosofía de diseño

**"Catálogo de mostrador, no tienda en línea."** GPar no vende con carrito y pago: el cliente arma una lista y pide precio. Todo el diseño empuja a una sola acción: **Solicitar cotización**.

Cinco principios:

1. **Utilidad antes que estética.** El usuario llega con un equipo parado y un repuesto que identificar. Búsqueda y categorías mandan; nada de secciones decorativas.
2. **Densidad honesta.** Tarjetas con código, especificaciones y línea de producto visibles sin abrir nada. El código de referencia (`GP-6205RS`) siempre en monoespaciada.
3. **Esquinas rectas, sin sombras suaves.** `border-radius: 0` en todo el sistema (excepto el logo). El lenguaje es de ficha técnica y etiqueta de almacén, no de app de consumo.
4. **Naranja como señal, no como fondo.** El naranja marca lo accionable y los cortes de sección; el resto es blanco y gris claro. Máximo dos fondos por página (blanco + `#F7F8FA`), más las franjas naranja.
5. **Móvil primero.** Buena parte del tráfico es un técnico con el teléfono en el taller. Objetivos táctiles ≥ 44px, botones a ancho completo en móvil, WhatsApp siempre a un toque.

**No hacer:** gradientes decorativos, emojis, tarjetas redondeadas con sombra, precios inventados, carrito con checkout.

---

## 2. Dos líneas de producto

La marca cubre **dos líneas** y la navegación debe hacerlas explícitas desde el primer scroll:

| Línea | Etiqueta en UI | Audiencia | Estado del contenido |
|---|---|---|---|
| **Industrial** | `Repuestos industriales` | Plantas, talleres, mantenimiento (B2B) | **Definida** — 15 categorías, ~90 referencias reales (ver `data/catalogo.json`) |
| **Automotriz** | `Repuestos automotrices` | Talleres automotrices y público general | **PLACEHOLDER** — categorías propuestas, GPar debe confirmar el surtido |

Implementación esperada: un **conmutador de línea** (dos pestañas / segmented control) encima de la grilla de categorías, y rutas separadas `/industrial` y `/automotriz`. La línea seleccionada persiste en la URL (`?linea=industrial`), no en estado efímero.

Categorías industriales (confirmadas): Rodamientos · Chumaceras · Correas · Poleas · Cadenas y piñones · Acoples · Sellos mecánicos · Estoperas industriales · Mangueras industriales · Motores y reductores · Ventiladores axiales · Bandas transportadoras · Guayas y cadenas de carga.

Categorías automotrices (**propuestas, por confirmar**): Rodamientos de rueda y masas · Correas y kits de distribución · Bandas de accesorios · Retenes y estoperas · Bombas de agua · Mangueras y abrazaderas · Kits de embrague · Amortiguadores y suspensión · Frenos · Filtros. Ninguna trae referencias todavía; se muestran con el estado "Próximamente" hasta que GPar entregue el listado.

---

## 3. Color

Ver `tokens/tokens.css` y `tokens/tokens.json` (fuente de verdad).

| Token | Hex | Uso |
|---|---|---|
| `--gp-orange` | `#F57C00` | Fondo de botón primario, franja superior, banda CTA, badge del contador |
| `--gp-orange-ink` | `#D96A00` | Naranja **para texto** sobre blanco: enlaces, kickers, "Ver productos →" |
| `--gp-orange-soft` | `#FFF3E6` | Fondo de píldoras/badges |
| `--gp-orange-border` | `#FBD3A8` | Borde de píldoras/badges |
| `--gp-ink` | `#1D2430` | Texto principal, fondo del footer, botón secundario |
| `--gp-ink-2` | `#5C6675` | Párrafos, texto secundario |
| `--gp-ink-3` | `#8A94A2` | Metadatos, códigos, labels |
| `--gp-ink-4` | `#98A2B0` | Marcas, texto del footer |
| `--gp-line` | `#E4E7EC` | Borde por defecto |
| `--gp-line-soft` | `#EEF0F3` | Borde interno de tarjeta |
| `--gp-surface` | `#F7F8FA` | Sección alterna, inputs, thumbnails vacíos |
| `--gp-bg` | `#FFFFFF` | Fondo base |

**Reglas de contraste (obligatorias):**
- Texto sobre naranja `#F57C00` → siempre `#1D2430`. **Nunca blanco.**
- Naranja como texto sobre blanco → usar `#D96A00`, nunca `#F57C00` (no llega a 4.5:1).
- Sobre la foto del hero va el velo blanco `--heroWash`; el titular es `#1D2430` sólido, sin opacidades.

---

## 4. Tipografía

Google Fonts: `Barlow Condensed` (600/700/800) · `IBM Plex Sans` (400/500/600/700) · `IBM Plex Mono` (400/500).
En Next.js cargar con `next/font/google` y exponer como variables CSS (`--gp-font-display`, etc.).

| Rol | Familia | Tamaño | Peso | Detalles |
|---|---|---|---|---|
| H1 hero | Display | `clamp(34px, 5.4vw, 62px)` | 800 | MAYÚSCULAS, `line-height: 0.97`, tracking `0.02em`, salto de línea manual en 3 renglones |
| H1 categoría | Display | `clamp(32px, 4.4vw, 46px)` | 800 | MAYÚSCULAS, `line-height: 1` |
| H2 sección | Display | `clamp(28px, 3.4vw, 38px)` | 800 | MAYÚSCULAS |
| H2 secundario | Display | `26px` | 800 | MAYÚSCULAS (bloque "¿Cómo podemos ayudarte?") |
| H3 tarjeta de categoría | Display | `21px` | 700 | MAYÚSCULAS, `line-height: 1.05` |
| H3 tarjeta de producto | Body | `15px` | 700 | Capitalización normal, `line-height: 1.25` |
| Bajada del hero | Body | `17px` | 400 | `#5C6675`, `max-width: 50ch` |
| Párrafo de sección | Body | `15.5–16px` | 400 | `#5C6675` |
| Texto de tarjeta | Body | `13.5px` | 400 | `#5C6675` |
| Botón | Body | `13.5–14px` | 600–700 | Sin mayúsculas forzadas |
| Código de producto | Mono | `11.5px` | 400 | `#8A94A2` |
| Kicker / label | Mono | `11–12px` | 400 | MAYÚSCULAS, tracking `0.10–0.14em` |

Cuerpo base `line-height: 1.5`. Aplicar `text-wrap: pretty` a párrafos y `text-wrap: balance` a titulares.

---

## 5. Layout y breakpoints

Mobile-first. Contenedor `max-width: 1220px`, centrado, padding lateral `20px` (móvil) → `24px` (≥768px).

| Breakpoint | Ancho | Cambios |
|---|---|---|
| base | < 480px | 1 columna. Buscador debajo del logo, a ancho completo. Nav principal colapsada en menú. Botones CTA a ancho completo, apilados. Hero: padding `44px 20px`, velo casi opaco. |
| `sm` | ≥ 480px | Categorías y productos en 2 columnas. |
| `md` | ≥ 768px | Nav horizontal visible. Hero con `max-width: 640px` de texto sobre la foto. Secciones a `60px` verticales. Grilla de 3 columnas. |
| `lg` | ≥ 1024px | Buscador inline en el header. Categorías 4 col / productos 4 col. Bloque de cotización a 2 columnas. |
| `xl` | ≥ 1280px | Sin cambios estructurales; el contenedor topa en 1220px. |

Grillas (CSS Grid, `gap: 16px`):
- Categorías: `repeat(auto-fill, minmax(228px, 1fr))`
- Productos: `repeat(auto-fill, minmax(250px, 1fr))`
- Tarjetas de ayuda / razones: `repeat(auto-fit, minmax(215px, 1fr))`, `gap: 14px` / `26px`

Alturas de imagen: categoría `150px`, producto en grilla `150px`, producto destacado `130px`. Siempre `object-fit: cover` sobre fondo `#F7F8FA`.

---

## 6. Secciones (orden en la home)

1. **Franja superior** — fondo `#F57C00`, texto `#1D2430` a 12.5px, dos mensajes en extremos opuestos: "Soluciones para la industria" · "Pedidos y cotizaciones por WhatsApp". Se oculta bajo 480px.
2. **Header** (sticky, `z: 60`) — logo circular 46px + lockup "DISTRIBUIDORA / GPAR", buscador, nav (Inicio · Industrial · Automotriz · Contacto), botón **"Mi cotización (n)"**. Borde inferior `1px #E4E7EC`, fondo blanco sólido.
3. **Hero** — foto de almacén a sangre + velo blanco en diagonal. Badge mono, H1 en tres renglones con la última línea en naranja, bajada, dos CTA (primario "Solicitar cotización", secundario "Ver el catálogo"), fila de chips de acceso rápido.
4. **Marquesina de categorías** — franja blanca con borde, nombres en display 15px `#8A94A2` separados por `/` naranja, desplazamiento infinito 42s.
5. **¿Cómo podemos ayudarte?** — 4 tarjetas `#F7F8FA` con borde superior naranja 3px: Buscar por código · Explorar categorías · Armar tu lista · Pedir cotización.
6. **Conmutador de línea + Catálogo de categorías** — encabezado con H2, bajada y contador mono (`{n} referencias · {m} categorías`); pestañas Industrial / Automotriz; grilla de tarjetas de categoría.
7. **Banda CTA "¿No sabes el código del repuesto?"** — fondo naranja completo, botón blanco "Pedir asesoría".
8. **Productos destacados** — 8 tarjetas de producto compactas.
9. **Marcas** — fondo `#F7F8FA`, label mono y nombres en display 26px `#98A2B0`. ⚠️ *Los nombres actuales son placeholder: GPar debe confirmar qué marcas está autorizado a exhibir; no usar logotipos oficiales sin permiso.*
10. **¿Por qué comprar en GPar?** — 4 razones con regla naranja de 34×3px.
11. **Solicita tu cotización** — dos columnas: datos de contacto + formulario.
12. **Footer** — `#1D2430`, cuatro columnas (marca, navegación, categorías, contacto) + línea legal.

### Página de categoría (`/[linea]/[categoria]`)
Breadcrumb → encabezado (kicker, H1, descripción, botón "← Volver al inicio") → **barra de subfiltros sticky** (`top: var(--gp-header-h)`, `z: 40`) con contador "n de m" → grilla de productos → barra flotante inferior si hay ítems en la lista (`z: 55`, borde superior naranja 3px).

⚠️ El alto del header **no es constante**: cambia por breakpoint y también al envolver contenido (a <480px la marca y el botón de cotización caen a dos filas). **Medirlo en runtime**: un `ResizeObserver` sobre `.header` que escriba `--gp-header-h` en `:root`, y usar `top: var(--gp-header-h)` en la barra de filtros. Los valores por breakpoint (152px base · 136px ≥768px · 80px ≥1024px) son solo el fallback antes de la hidratación. Un valor fijo deja la barra escondida detrás del header.

### Página de resultados de búsqueda (`/buscar?q=`)
Misma plantilla que categoría; kicker "Búsqueda en el catálogo", sin subfiltros, y estado vacío: caja punteada con "Sin resultados" + botón "Solicitar el producto".

### Panel de lista de cotización (drawer)
Lateral derecho `min(420px, 100%)`, scrim `rgba(29,36,48,0.45)`. Filas con thumbnail 54px, nombre, `código · categoría`, stepper − / n / +, "Quitar". Pie con nota "Sin pago en línea…" y dos botones: **"Solicitar cotización"** (primario) y "Enviar por WhatsApp" (secundario).

---

## 7. Componentes y estados

**Botón primario** — fondo `#F57C00`, texto `#1D2430` 700 / 14px, padding `14px 24px`, sin borde ni radio. Hover: fondo `#D96A00`. Active: `translateY(1px)`. Focus: `outline: 2px solid #1D2430; outline-offset: 2px`.
**Botón secundario** — fondo blanco, borde `1px #1D2430`, texto `#1D2430` 600. Hover: fondo `#1D2430`, texto blanco.
**Botón terciario / "Cotizar"** — fondo `#F7F8FA`, borde `1px #E4E7EC`.

**Tarjeta de categoría** — borde `1px #E4E7EC`, imagen 150px, título display, descripción, pie con `n ítems` (mono) y "Ver productos →" en `#D96A00`. Hover: `border-color: #F57C00`. Toda la tarjeta es un enlace (`<Link>`), no un `div` con `onClick`.

**Tarjeta de producto** — imagen 150px con badge de stock arriba a la derecha (blanco, borde gris, mono 10px); cuerpo con código mono, nombre 15px/700, fila de specs separada por línea punteada (`1px dashed #E4E7EC`), dos píldoras (subcategoría en naranja suave, marca en gris), precio opcional (`Precio a consultar`, oculto por defecto) y dos botones: "+ Agregar a la cotización" / "Cotizar". Cuando está en la lista: borde de tarjeta `#F57C00`, botón invertido (`#1D2430` con texto blanco) y label "✓ En la cotización".

**Input** — fondo `#F7F8FA`, borde `1px #E4E7EC`, padding `11px 12px`, 14px, sin radio. Focus: `border-color: #D96A00`.

**Píldora de subfiltro** — inactiva: blanco, borde `#E4E7EC`, texto `#5C6675`; activa: fondo `#1D2430`, texto blanco.

---

## 8. Animaciones

| Elemento | Animación |
|---|---|
| Marquesina de categorías | `translateX(0 → -50%)`, 42s lineal infinita, lista duplicada para bucle sin costura. Se detiene con `prefers-reduced-motion`. |
| Hover de tarjeta | `border-color` 180ms `cubic-bezier(0.2,0.6,0.2,1)`. Sin `transform` ni sombra. |
| Botones | `background` 120ms; `translateY(1px)` en `:active`. |
| Drawer de cotización | Entra desde la derecha 220ms ease-out; scrim con fade 180ms. |
| Barra flotante inferior | Aparece con `translateY(100% → 0)` 200ms al agregar el primer ítem. |
| Cambio de vista | Scroll al tope inmediato (`window.scrollTo(0,0)`); en Next.js esto lo resuelve la navegación por ruta. **No usar `scrollIntoView`.** |

Todo bajo `@media (prefers-reduced-motion: reduce)`: transiciones a 1ms, marquesina detenida.

---

## 9. CTAs y jerarquía de acción

| Prioridad | Texto | Dónde | Acción |
|---|---|---|---|
| 1 | **Solicitar cotización** | Hero (primario), header (drawer), tarjetas de producto, drawer, formulario | Abre el formulario/drawer de cotización |
| 2 | Ver el catálogo | Hero (secundario) | Ancla a la sección de categorías |
| 2 | + Agregar a la cotización | Tarjeta de producto | Agrega el ítem a la lista |
| 3 | Enviar por WhatsApp | Drawer, formulario | `https://wa.me/<numero>?text=<mensaje>` en pestaña nueva |
| 3 | Pedir asesoría | Banda CTA naranja | Ancla al formulario de contacto |
| 4 | Ver productos → | Tarjeta de categoría | Navega a la página de categoría |

**Regla:** en cualquier viewport siempre hay un CTA de cotización visible — en el header (desktop) o en la barra flotante inferior (móvil, cuando la lista tiene ítems).

Mensaje de WhatsApp generado (mantener el formato):

    Hola GPar, quisiera solicitar una *cotización* de los siguientes productos:

    • Rodamiento rígido de bolas 6205-2RS (GP-6205RS) x2
    • Correa trapezoidal A-45 (GP-A45) x1

    Gracias.

Si la lista está vacía, el cuerpo se sustituye por: `(Todavía no seleccioné productos, necesito asesoría para identificar la pieza)`.

---

## 10. Estado y datos

Estado necesario (en el prototipo era un solo componente; en Next.js sepáralo):

- `linea`: `"industrial" | "automotriz"` → URL.
- `categoria`, `subfiltro`, `q` → URL (`/[linea]/[categoria]?sub=Cónico`, `/buscar?q=6205`).
- `cotizacion`: `Record<codigo, cantidad>` → contexto de cliente + `localStorage` (`gpar:cotizacion`). Es lo único que debe sobrevivir a la recarga.
- `drawerAbierto`: estado local del layout de cliente.

Datos: `data/catalogo.json` trae las 15 categorías industriales con sus ítems (`codigo`, `nombre`, `subcategoria`, `marca`, `specs[]`). En producción debería venir de un CMS o de un export del inventario; la forma del JSON está pensada para que el componente no cambie.

Server Components para la grilla y las páginas de categoría; solo el header, el drawer, los botones de agregar y el formulario son `"use client"`.

---

## 11. Tailwind

Extiende el tema en lugar de escribir clases arbitrarias:

    // tailwind.config.ts
    theme: {
      extend: {
        colors: {
          gpar: {
            orange: '#F57C00', orangeInk: '#D96A00',
            orangeSoft: '#FFF3E6', orangeBorder: '#FBD3A8',
            ink: '#1D2430', ink2: '#5C6675', ink3: '#8A94A2', ink4: '#98A2B0',
            line: '#E4E7EC', lineSoft: '#EEF0F3', surface: '#F7F8FA'
          }
        },
        fontFamily: {
          display: ['var(--gp-font-display)'],
          sans: ['var(--gp-font-body)'],
          mono: ['var(--gp-font-mono)']
        },
        maxWidth: { container: '1220px' },
        borderRadius: { DEFAULT: '0px' },
        screens: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px' }
      }
    }

Nota: el sistema es de **esquinas rectas**; conviene sobrescribir `borderRadius.DEFAULT` a `0px` para que ningún componente heredado redondee por accidente.

---

## 12. Accesibilidad

- Objetivos táctiles ≥ 44px de alto en móvil (los botones actuales de 10–14px de padding cumplen con `min-height: 44px`).
- Todo lo navegable debe ser `<a>`/`<Link>` o `<button>` — en el prototipo hay `<span onClick>`, **no replicarlos**.
- El drawer necesita `role="dialog"`, `aria-modal`, trampa de foco y cierre con `Esc`.
- La marquesina va con `aria-hidden="true"` (es decorativa).
- Las imágenes de producto necesitan `alt` con el nombre del producto; los slots vacíos, `alt=""`.
- Estados de foco visibles en toda la interfaz (`outline: 2px solid #1D2430`).

---

## 13. Fidelidad

**Alta fidelidad.** Colores, tipografía, espaciados y textos son finales salvo lo marcado como placeholder en `README.md` § Placeholders. Recrear pixel a pixel usando los patrones del código destino.
