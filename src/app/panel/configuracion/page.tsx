import Link from "next/link";

import { PaginaPlaceholderPanel } from "@/componentes/panel/PaginaPlaceholderPanel";
import { empresa } from "@/configuracion/empresa";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import {
  requerirPermiso,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function PaginaPanelConfiguracion() {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.PANEL_VER,
    "/panel/configuracion",
  );

  const puedeUsuarios = tienePermiso(sesion, CODIGOS_PERMISO.USUARIOS_VER);

  return (
    <PaginaPlaceholderPanel
      titulo="Configuración"
      descripcion="Accesos de administración y datos de empresa."
    >
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
