import { redirect } from "next/navigation";

import { ShellPanel } from "@/componentes/panel/ShellPanel";
import { obtenerSesion } from "@/modulos/autenticacion/servicio-sesion";

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

  const nombreUsuario = [sesion.nombre, sesion.apellido]
    .filter(Boolean)
    .join(" ");

  return <ShellPanel nombreUsuario={nombreUsuario}>{children}</ShellPanel>;
}
