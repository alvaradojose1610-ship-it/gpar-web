/**
 * QR de producto (estante): la etiqueta imprime la URL `/p/<tokenPublico>`.
 * El POS debe resolver esa URL (o el token) al producto interno.
 */

/** Token público de producto (cuid u opaco similar). */
export const RE_TOKEN_PRODUCTO_PUBLICO = /^[a-zA-Z0-9_-]{8,64}$/;

const RE_URL_TOKEN = /\/p\/([a-zA-Z0-9_-]{8,64})\/?$/i;

/**
 * Extrae el token público desde contenido escaneado o pegado
 * (URL completa, path `/p/...` o token suelto).
 */
export function extraerTokenQrProducto(contenido: string): string | null {
  const bruto = contenido.trim();
  if (!bruto) return null;

  try {
    const sinQuery = bruto.split(/[?#]/)[0] ?? bruto;
    const m = RE_URL_TOKEN.exec(sinQuery);
    if (m?.[1] && RE_TOKEN_PRODUCTO_PUBLICO.test(m[1])) return m[1];
  } catch {
    /* ignore */
  }

  if (RE_TOKEN_PRODUCTO_PUBLICO.test(bruto) && !/[\s/]/.test(bruto)) {
    return bruto;
  }

  return null;
}
