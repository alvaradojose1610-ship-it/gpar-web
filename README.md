# GPar — Portal + Panel integrado

Sistema de Distribuidora GPar: catálogo público (industrial / automotriz) + panel interno.

**Sitio:** https://gparsoluciones.com

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4
- Prisma 7 + PostgreSQL (**Neon** proyecto `gpar-web`)
- Auth: bcryptjs + JWT jose (cookie `gpar_sesion`)

## Arranque local

```bash
npm install
npm run dev
```

Variables en `.env.local` (ya configuradas en este entorno):

- `DATABASE_URL` / `DIRECT_URL` — Neon
- `SESSION_SECRET`

También sincronizadas en Vercel (production / preview / development).

### Acceso panel

- URL: `/login`
- Usuario: `admin`
- Clave: `123` — cambiar en producción cuando haya más personal

### Roles del sistema

| Rol | Uso |
|-----|-----|
| **ADMINISTRADOR** | Todo el panel |
| **VENDEDOR** | Ventas POS, cotizaciones, ver productos |
| **ALMACEN** | Productos, compras, inventario |
| **CONSULTA** | Solo lectura |
## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home catálogo |
| `/industrial`, `/automotriz` | Líneas |
| `/buscar`, `/cotizar` | Búsqueda y cotización (guarda en BD) |
| `/p/[token]` | Ficha QR de estante |
| `/login` | Acceso panel |
| `/panel/*` | Sistema interno |

## Scripts

```bash
npm run typecheck
npm run lint
npm run build
npm run prisma:generate
npm run db:push
npm run seed
```

## Diseño

Handoff en `design_handoff_gpar/`. Tokens `--gp-*`. Sin fotos reales aún: placeholders.
