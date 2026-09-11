# Componentes por sección

Cada archivo es un fragmento HTML aislado con la marcación y las clases exactas de la sección.
No son componentes React: son la referencia estructural para escribirlos en el codebase destino.
Todos dependen de `tokens/tokens.css` y `reference/styles.css`.

| Archivo | Componente Next.js sugerido | Cliente/Servidor |
|---|---|---|
| 01-topbar.html | `<TopBar />` | servidor |
| 02-header.html | `<SiteHeader />` | cliente (buscador, contador, menú) |
| 03-hero.html | `<Hero />` | servidor |
| 04-strip.html | `<CategoryStrip />` | servidor |
| 05-help-cards.html | `<HelpCards />` | servidor |
| 06-line-switch.html | `<LineSwitch />` | servidor (estado en la URL) |
| 07-category-card.html | `<CategoryCard />` | servidor |
| 08-product-card.html | `<ProductCard />` | cliente (botón agregar) |
| 09-cta-band.html | `<CtaBand />` | servidor |
| 10-filters.html | `<SubFilters />` | cliente |
| 11-quote-drawer.html | `<QuoteDrawer />` | cliente |
| 12-action-bar.html | `<MobileActionBar />` | cliente |
| 13-quote-form.html | `<QuoteForm />` | cliente |
| 14-footer.html | `<SiteFooter />` | servidor |
| 15-empty-state.html | `<EmptyResults />` | servidor |
