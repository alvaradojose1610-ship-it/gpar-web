"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { CODIGOS_PERMISO, esCodigoPermiso } from "@/configuracion/permisos";
import { prisma } from "@/lib/prisma";
import {
  hashearClave,
  requerirPermiso,
} from "@/modulos/autenticacion/servicio-sesion";

const esquemaUsuarioBase = z.object({
  nombre: z.string().trim().min(2).max(120),
  apellido: z.string().trim().max(120).optional(),
  usuario: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .regex(/^[a-zA-Z0-9._-]+$/, "Usuario inválido"),
  correo: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().email().max(200).optional(),
  ),
  activo: z.boolean(),
  rolesIds: z.array(z.string().min(1)).min(1, "Asigna al menos un rol"),
});

async function contarAdminsActivos(excluirUsuarioId?: string) {
  return prisma.usuario.count({
    where: {
      activo: true,
      ...(excluirUsuarioId ? { id: { not: excluirUsuarioId } } : {}),
      roles: { some: { rol: { codigo: "ADMINISTRADOR", activo: true } } },
    },
  });
}

function parseRolesIds(formData: FormData): string[] {
  return formData
    .getAll("rolesIds")
    .map((v) => String(v).trim())
    .filter(Boolean);
}

export async function accionCrearUsuario(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.USUARIOS_EDITAR, "/panel/usuarios");

  const clave = String(formData.get("clave") ?? "");
  const clave2 = String(formData.get("claveConfirmacion") ?? "");
  if (clave.length < 6 || clave !== clave2) {
    redirect("/panel/usuarios/nuevo?error=clave");
  }

  const parsed = esquemaUsuarioBase.safeParse({
    nombre: formData.get("nombre"),
    apellido: String(formData.get("apellido") ?? "") || undefined,
    usuario: formData.get("usuario"),
    correo: String(formData.get("correo") ?? "") || undefined,
    activo: formData.get("activo") === "on",
    rolesIds: parseRolesIds(formData),
  });

  if (!parsed.success) {
    redirect("/panel/usuarios/nuevo?error=datos");
  }

  const datos = parsed.data;
  const existe = await prisma.usuario.findUnique({
    where: { usuario: datos.usuario.toLowerCase() },
  });
  if (existe) {
    redirect("/panel/usuarios/nuevo?error=usuario");
  }

  if (datos.correo) {
    const correoTomado = await prisma.usuario.findUnique({
      where: { correo: datos.correo },
    });
    if (correoTomado) {
      redirect("/panel/usuarios/nuevo?error=correo");
    }
  }

  const roles = await prisma.rol.findMany({
    where: { id: { in: datos.rolesIds }, activo: true },
  });
  if (roles.length !== datos.rolesIds.length) {
    redirect("/panel/usuarios/nuevo?error=datos");
  }

  const claveHash = await hashearClave(clave);
  await prisma.usuario.create({
    data: {
      nombre: datos.nombre,
      apellido: datos.apellido ?? null,
      usuario: datos.usuario.toLowerCase(),
      correo: datos.correo ?? null,
      activo: datos.activo,
      claveHash,
      roles: {
        create: roles.map((r) => ({ rolId: r.id })),
      },
    },
  });

  revalidatePath("/panel/usuarios");
  redirect("/panel/usuarios?ok=creado");
}

export async function accionActualizarUsuario(formData: FormData) {
  const sesion = await requerirPermiso(
    CODIGOS_PERMISO.USUARIOS_EDITAR,
    "/panel/usuarios",
  );

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/usuarios?error=datos");

  const parsed = esquemaUsuarioBase.safeParse({
    nombre: formData.get("nombre"),
    apellido: String(formData.get("apellido") ?? "") || undefined,
    usuario: formData.get("usuario"),
    correo: String(formData.get("correo") ?? "") || undefined,
    activo: formData.get("activo") === "on",
    rolesIds: parseRolesIds(formData),
  });

  if (!parsed.success) {
    redirect(`/panel/usuarios/${id}/editar?error=datos`);
  }

  const datos = parsed.data;
  const actual = await prisma.usuario.findUnique({
    where: { id },
    include: { roles: { include: { rol: true } } },
  });
  if (!actual) redirect("/panel/usuarios?error=datos");

  const eraAdmin = actual.roles.some((ur) => ur.rol.codigo === "ADMINISTRADOR");
  const roles = await prisma.rol.findMany({
    where: { id: { in: datos.rolesIds }, activo: true },
  });
  if (roles.length !== datos.rolesIds.length) {
    redirect(`/panel/usuarios/${id}/editar?error=datos`);
  }
  const seraAdmin = roles.some((r) => r.codigo === "ADMINISTRADOR");

  if (actual.activo && (!datos.activo || (eraAdmin && !seraAdmin))) {
    const otrosAdmins = await contarAdminsActivos(id);
    if (eraAdmin && otrosAdmins === 0) {
      redirect(`/panel/usuarios/${id}/editar?error=ultimo-admin`);
    }
  }

  if (id === sesion.id && !datos.activo) {
    redirect(`/panel/usuarios/${id}/editar?error=auto`);
  }

  const otroUsuario = await prisma.usuario.findFirst({
    where: {
      usuario: datos.usuario.toLowerCase(),
      id: { not: id },
    },
  });
  if (otroUsuario) {
    redirect(`/panel/usuarios/${id}/editar?error=usuario`);
  }

  if (datos.correo) {
    const otroCorreo = await prisma.usuario.findFirst({
      where: { correo: datos.correo, id: { not: id } },
    });
    if (otroCorreo) {
      redirect(`/panel/usuarios/${id}/editar?error=correo`);
    }
  }

  const rolesCambiaron =
    actual.roles.length !== roles.length ||
    actual.roles.some((ur) => !roles.some((r) => r.id === ur.rolId));

  const claveNueva = String(formData.get("clave") ?? "");
  const clave2 = String(formData.get("claveConfirmacion") ?? "");
  let claveHash: string | undefined;
  if (claveNueva || clave2) {
    if (claveNueva.length < 6 || claveNueva !== clave2) {
      redirect(`/panel/usuarios/${id}/editar?error=clave`);
    }
    claveHash = await hashearClave(claveNueva);
  }

  await prisma.$transaction(async (tx) => {
    await tx.usuarioRol.deleteMany({ where: { usuarioId: id } });
    await tx.usuario.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        apellido: datos.apellido ?? null,
        usuario: datos.usuario.toLowerCase(),
        correo: datos.correo ?? null,
        activo: datos.activo,
        ...(claveHash ? { claveHash } : {}),
        ...(rolesCambiaron || claveHash
          ? { versionSesion: { increment: 1 } }
          : {}),
        roles: {
          create: roles.map((r) => ({ rolId: r.id })),
        },
      },
    });
  });

  revalidatePath("/panel/usuarios");
  revalidatePath(`/panel/usuarios/${id}/editar`);
  redirect("/panel/usuarios?ok=actualizado");
}

export async function accionActualizarPermisosRol(formData: FormData) {
  await requerirPermiso(CODIGOS_PERMISO.USUARIOS_EDITAR, "/panel/roles");

  const rolId = String(formData.get("rolId") ?? "");
  if (!rolId) redirect("/panel/roles?error=datos");

  const rol = await prisma.rol.findUnique({ where: { id: rolId } });
  if (!rol) redirect("/panel/roles?error=datos");

  const codigos = formData
    .getAll("permisos")
    .map((v) => String(v))
    .filter(esCodigoPermiso);

  const permisos = await prisma.permiso.findMany({
    where: { codigo: { in: codigos } },
  });

  await prisma.$transaction(async (tx) => {
    await tx.rolPermiso.deleteMany({ where: { rolId } });
    if (permisos.length > 0) {
      await tx.rolPermiso.createMany({
        data: permisos.map((p) => ({ rolId, permisoId: p.id })),
      });
    }
  });

  const usuariosDelRol = await prisma.usuarioRol.findMany({
    where: { rolId },
    select: { usuarioId: true },
  });
  if (usuariosDelRol.length > 0) {
    await prisma.usuario.updateMany({
      where: { id: { in: usuariosDelRol.map((u) => u.usuarioId) } },
      data: { versionSesion: { increment: 1 } },
    });
  }

  revalidatePath("/panel/roles");
  revalidatePath(`/panel/roles/${rolId}`);
  redirect(`/panel/roles/${rolId}?ok=permisos`);
}
