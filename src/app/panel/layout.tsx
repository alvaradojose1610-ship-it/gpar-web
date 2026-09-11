import { redirect } from "next/navigation";

import { ShellPanel } from "@/componentes/panel/ShellPanel";
import { filtrarNavegacionPanel } from "@/configuracion/navegacion-panel";
import { CODIGOS_PERMISO } from "@/configuracion/permisos";
import { vencerApartadosCaducados } from "@/modulos/apartados/acciones";
import {
  obtenerSesion,
  tienePermiso,
} from "@/modulos/autenticacion/servicio-sesion";

export const dynamic = "force-dynamic";

export default async function LayoutPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    redirect("/login?next=/panel");
  }

  if (!tienePermiso(sesion, CODIGOS_PERMISO.PANEL_VER)) {
    redirect("/login?next=/panel");
  }

  // Libera reservas vencidas en cada visita al panel (stock disponible correcto).
  await vencerApartadosCaducados();

  const nombreUsuario = [sesion.nombre, sesion.apellido]
    .filter(Boolean)
    .join(" ");

  const itemsNav = filtrarNavegacionPanel(sesion.permisos);

  return (
    <ShellPanel nombreUsuario={nombreUsuario} itemsNav={itemsNav}>
      {children}
    </ShellPanel>
  );
}
