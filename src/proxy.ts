import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_SESION } from "@/modulos/autenticacion/constantes";
import { leerSessionSecretOpcional } from "@/lib/env";
import { verificarJwtHs256 } from "@/lib/verificar-jwt-hs256";

/**
 * Solo protege /panel/*.
 * Público: resto del sitio, /login, /p/*, /api/auth/*.
 * La autorización fina (permisos) se valida en servidor con la BD.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const esPanel = pathname === "/panel" || pathname.startsWith("/panel/");
  if (!esPanel) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_SESION)?.value;
  if (!token) {
    return redirigirLogin(request, pathname);
  }

  const secret = leerSessionSecretOpcional();
  if (!secret) {
    return redirigirLogin(request, pathname);
  }

  const payload = await verificarJwtHs256(token, secret);
  if (!payload) {
    const respuesta = redirigirLogin(request, pathname);
    respuesta.cookies.set(COOKIE_SESION, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return respuesta;
  }

  return NextResponse.next();
}

function redirigirLogin(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/panel", "/panel/:path*"],
};
