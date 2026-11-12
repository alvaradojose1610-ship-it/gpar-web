import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { empresa } from "@/configuracion/empresa";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import {
  requerirPermiso,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";
import { accionActualizarHeroInicio } from "@/modulos/configuracion/acciones";
import {
  SUBTITULO_HERO_POR_DEFECTO,
  TITULO_HERO_POR_DEFECTO,
  obtenerContenidoHero,
} from "@/modulos/configuracion/servicio-empresa";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ ok?: string; error?: string }>;
};

export default async function PaginaPanelConfiguracion({ searchParams }: Props) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.PANEL_VER,
    "/panel/configuracion",
  );
  const params = await searchParams;
  const hero = await obtenerContenidoHero();

  const puedeUsuarios = tienePermiso(sesion, CODIGOS_PERMISO.USUARIOS_VER);

  const mensajeOk =
    params.ok === "hero" ? "Título y subtítulo del inicio actualizados." : null;
  const mensajeError =
    params.error === "datos"
      ? "Revisa el título y el subtítulo (mínimo 2 caracteres)."
      : params.error === "empresa"
        ? "No hay configuración de empresa activa. Ejecutá el seed."
        : null;

  return (
    <PaginaPlaceholderPanel
      titulo="Configuración"
      descripcion="Accesos de administración y datos de empresa."
    >
      {mensajeOk ? (
        <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {mensajeOk}
        </p>
      ) : null}
      {mensajeError ? (
        <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {mensajeError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {puedeUsuarios ? (
          <>
            <Link
              href="/panel/usuarios"
              className="border border-[#E4E7EC] bg-white p-4 hover:border-[#F57C00]"
            >
              <h2 className="font-display text-lg font-bold uppercase text-[#1D2430]">
                Usuarios
              </h2>
              <p className="mt-1 text-sm text-[#5C6675]">
                Crear cuentas, activar/desactivar y asignar roles.
              </p>
            </Link>
            <Link
              href="/panel/roles"
              className="border border-[#E4E7EC] bg-white p-4 hover:border-[#F57C00]"
            >
              <h2 className="font-display text-lg font-bold uppercase text-[#1D2430]">
                Roles y permisos
              </h2>
              <p className="mt-1 text-sm text-[#5C6675]">
                Ajustar qué puede hacer cada rol del panel.
              </p>
            </Link>
          </>
        ) : null}

        <form
          action={accionActualizarHeroInicio}
          className="grid gap-3 border border-[#E4E7EC] bg-white p-4 sm:col-span-2"
        >
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-[#1D2430]">
              Hero de inicio
            </h2>
            <p className="mt-1 text-sm text-[#5C6675]">
              Título y subtítulo públicos. En el título, cada línea del
              textarea se muestra en una fila tipográfica distinta.
            </p>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-[#1D2430]">Título</span>
            <textarea
              name="tituloHero"
              required
              rows={3}
              maxLength={200}
              defaultValue={hero.tituloHero || TITULO_HERO_POR_DEFECTO}
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2 font-display text-base uppercase leading-tight"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-[#1D2430]">Subtítulo</span>
            <textarea
              name="subtituloHero"
              required
              rows={4}
              maxLength={600}
              defaultValue={hero.subtituloHero || SUBTITULO_HERO_POR_DEFECTO}
              className="border border-[#E4E7EC] bg-[#F7F8FA] px-3 py-2"
            />
          </label>
          <div>
            <button
              type="submit"
              className="bg-[#F57C00] px-4 py-2 text-sm font-bold text-[#1D2430] hover:bg-[#E65100]"
            >
              Guardar textos del hero
            </button>
          </div>
        </form>

        <div className="border border-[#E4E7EC] bg-white p-4 sm:col-span-2">
          <h2 className="font-display text-lg font-bold uppercase text-[#1D2430]">
            Empresa
          </h2>
          <p className="mt-1 text-sm text-[#5C6675]">
            Datos confirmados (solo lectura). Correo y dirección textual
            pendientes.
          </p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#5C6675]">Nombre legal</dt>
              <dd className="font-medium text-[#1D2430]">
                {empresa.nombreLegal}
              </dd>
            </div>
            <div>
              <dt className="text-[#5C6675]">WhatsApp</dt>
              <dd className="font-medium text-[#1D2430]">
                {empresa.contacto.whatsapp.valor}
              </dd>
            </div>
            <div>
              <dt className="text-[#5C6675]">Teléfono</dt>
              <dd className="font-medium text-[#1D2430]">
                {empresa.contacto.telefono.valor}
              </dd>
            </div>
            <div>
              <dt className="text-[#5C6675]">Instagram</dt>
              <dd className="font-medium text-[#1D2430]">
                {empresa.redes.instagram.valor}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </PaginaPlaceholderPanel>
  );
}
