import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, LineaNegocio } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

import {
  LISTA_PERMISOS,
  PERMISOS_POR_ROL_SISTEMA,
} from "../src/configuracion/permisos";
import {
  categoriasIndustriales,
  productosIndustrialesMuestra,
} from "../src/datos/catalogo-industrial";
import { categoriasCargaPesada } from "../src/datos/catalogo-carga-pesada";
import { empresa } from "../src/configuracion/empresa";
import { cargarEnvLocal } from "./cargar-env";

cargarEnvLocal();

const CLAVE_ADMIN = "123";
const USUARIO_ADMIN = "admin";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL es requerida para el seed.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Sembrando permisos…");
    for (const permiso of LISTA_PERMISOS) {
      await prisma.permiso.upsert({
        where: { codigo: permiso.codigo },
        update: {
          nombre: permiso.nombre,
          modulo: permiso.modulo,
          descripcion: permiso.descripcion,
        },
        create: {
          codigo: permiso.codigo,
          nombre: permiso.nombre,
          modulo: permiso.modulo,
          descripcion: permiso.descripcion,
        },
      });
    }

    console.log("Sembrando roles…");
    const rolAdmin = await prisma.rol.upsert({
      where: { codigo: "ADMINISTRADOR" },
      update: {
        nombre: "Administrador",
        descripcion: "Acceso completo al panel",
        esSistema: true,
        activo: true,
      },
      create: {
        codigo: "ADMINISTRADOR",
        nombre: "Administrador",
        descripcion: "Acceso completo al panel",
        esSistema: true,
        activo: true,
      },
    });

    const rolVendedor = await prisma.rol.upsert({
      where: { codigo: "VENDEDOR" },
      update: {
        nombre: "Vendedor",
        descripcion: "Mostrador: ventas, cotizaciones y consulta de productos",
        esSistema: true,
        activo: true,
      },
      create: {
        codigo: "VENDEDOR",
        nombre: "Vendedor",
        descripcion: "Mostrador: ventas, cotizaciones y consulta de productos",
        esSistema: true,
        activo: true,
      },
    });

    const rolAlmacen = await prisma.rol.upsert({
      where: { codigo: "ALMACEN" },
      update: {
        nombre: "Almacén",
        descripcion: "Inventario, compras y productos",
        esSistema: true,
        activo: true,
      },
      create: {
        codigo: "ALMACEN",
        nombre: "Almacén",
        descripcion: "Inventario, compras y productos",
        esSistema: true,
        activo: true,
      },
    });

    const rolConsulta = await prisma.rol.upsert({
      where: { codigo: "CONSULTA" },
      update: {
        nombre: "Consulta",
        descripcion: "Solo lectura de catálogo, ventas e inventario",
        esSistema: true,
        activo: true,
      },
      create: {
        codigo: "CONSULTA",
        nombre: "Consulta",
        descripcion: "Solo lectura de catálogo, ventas e inventario",
        esSistema: true,
        activo: true,
      },
    });

    const permisos = await prisma.permiso.findMany();
    const porCodigo = new Map(permisos.map((p) => [p.codigo, p.id]));

    async function sincronizarPermisosRol(rolId: string, codigos: string[]) {
      const idsDeseados = new Set(
        codigos
          .map((codigo) => porCodigo.get(codigo))
          .filter((id): id is string => Boolean(id)),
      );
      const actuales = await prisma.rolPermiso.findMany({ where: { rolId } });
      for (const rp of actuales) {
        if (!idsDeseados.has(rp.permisoId)) {
          await prisma.rolPermiso.delete({ where: { id: rp.id } });
        }
      }
      for (const codigo of codigos) {
        const permisoId = porCodigo.get(codigo);
        if (!permisoId) continue;
        await prisma.rolPermiso.upsert({
          where: { rolId_permisoId: { rolId, permisoId } },
          update: {},
          create: { rolId, permisoId },
        });
      }
    }

    await sincronizarPermisosRol(
      rolAdmin.id,
      [...PERMISOS_POR_ROL_SISTEMA.ADMINISTRADOR],
    );
    await sincronizarPermisosRol(
      rolVendedor.id,
      [...PERMISOS_POR_ROL_SISTEMA.VENDEDOR],
    );
    await sincronizarPermisosRol(
      rolAlmacen.id,
      [...PERMISOS_POR_ROL_SISTEMA.ALMACEN],
    );
    await sincronizarPermisosRol(
      rolConsulta.id,
      [...PERMISOS_POR_ROL_SISTEMA.CONSULTA],
    );

    console.log("Sembrando usuario admin…");
    const claveHash = await bcrypt.hash(CLAVE_ADMIN, 12);
    const admin = await prisma.usuario.upsert({
      where: { usuario: USUARIO_ADMIN },
      update: {
        nombre: "Administrador",
        apellido: "GPar",
        claveHash,
        activo: true,
        versionSesion: { increment: 1 },
      },
      create: {
        nombre: "Administrador",
        apellido: "GPar",
        usuario: USUARIO_ADMIN,
        claveHash,
        activo: true,
      },
    });

    await prisma.usuarioRol.upsert({
      where: {
        usuarioId_rolId: {
          usuarioId: admin.id,
          rolId: rolAdmin.id,
        },
      },
      update: {},
      create: {
        usuarioId: admin.id,
        rolId: rolAdmin.id,
      },
    });

    console.log("Sembrando sucursal y almacén PRINCIPAL…");
    const sucursal = await prisma.sucursal.upsert({
      where: { codigo: "PRINCIPAL" },
      update: {
        nombre: "Sucursal principal",
        activa: true,
      },
      create: {
        codigo: "PRINCIPAL",
        nombre: "Sucursal principal",
        activa: true,
      },
    });

    await prisma.almacen.upsert({
      where: { codigo: "PRINCIPAL" },
      update: {
        nombre: "Almacén principal",
        sucursalId: sucursal.id,
        estado: "ACTIVO",
      },
      create: {
        codigo: "PRINCIPAL",
        nombre: "Almacén principal",
        sucursalId: sucursal.id,
        estado: "ACTIVO",
      },
    });

    console.log("Sembrando caja PRINCIPAL…");
    await prisma.caja.upsert({
      where: {
        sucursalId_codigo: {
          sucursalId: sucursal.id,
          codigo: "PRINCIPAL",
        },
      },
      update: {
        nombre: "Caja principal",
        activa: true,
      },
      create: {
        sucursalId: sucursal.id,
        codigo: "PRINCIPAL",
        nombre: "Caja principal",
        activa: true,
      },
    });

    console.log("Sembrando configuración de empresa…");
    const configExistente = await prisma.configuracionEmpresa.findFirst();
    if (!configExistente) {
      await prisma.configuracionEmpresa.create({
        data: {
          nombreComercial: empresa.nombreLegal,
          whatsapp: empresa.contacto.whatsapp.valor,
          instagram: empresa.redes.instagram.valor,
          mapsUrl: empresa.redes.maps.href,
          monedaPrincipal: "USD",
          monedaSecundaria: "VES",
        },
      });
    }

    console.log("Sembrando categorías industriales…");
    const mapaCategorias = new Map<string, string>();
    for (const [indice, categoria] of categoriasIndustriales.entries()) {
      const creada = await prisma.categoria.upsert({
        where: {
          linea_codigo: {
            linea: LineaNegocio.INDUSTRIAL,
            codigo: categoria.id,
          },
        },
        update: {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          publicada: categoria.publicada,
          orden: indice,
          estado: "ACTIVO",
        },
        create: {
          linea: LineaNegocio.INDUSTRIAL,
          codigo: categoria.id,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          publicada: categoria.publicada,
          orden: indice,
          estado: "ACTIVO",
        },
      });
      mapaCategorias.set(categoria.id, creada.id);
    }

    const codigosIndustrialesActivos = categoriasIndustriales.map((c) => c.id);
    const categoriasRetiradas = await prisma.categoria.findMany({
      where: {
        linea: LineaNegocio.INDUSTRIAL,
        codigo: { notIn: codigosIndustrialesActivos },
        OR: [{ publicada: true }, { estado: "ACTIVO" }],
      },
      select: { id: true, codigo: true },
    });
    if (categoriasRetiradas.length > 0) {
      const idsRetiradas = categoriasRetiradas.map((c) => c.id);
      console.log(
        `Desactivando categorías industriales retiradas: ${categoriasRetiradas
          .map((c) => c.codigo)
          .join(", ")}`,
      );
      await prisma.producto.updateMany({
        where: { categoriaId: { in: idsRetiradas } },
        data: { visibleWeb: false, estado: "INACTIVO" },
      });
      await prisma.categoria.updateMany({
        where: { id: { in: idsRetiradas } },
        data: { publicada: false, estado: "INACTIVO" },
      });
    }

    const marcaLoctite = await prisma.marca.findFirst({
      where: { nombre: { equals: "LOCTITE", mode: "insensitive" } },
      select: { id: true },
    });
    if (marcaLoctite) {
      console.log("Desactivando marca LOCTITE y sus productos…");
      await prisma.producto.updateMany({
        where: { marcaId: marcaLoctite.id },
        data: { visibleWeb: false, estado: "INACTIVO" },
      });
      await prisma.marca.update({
        where: { id: marcaLoctite.id },
        data: { visibleWeb: false, estado: "INACTIVO" },
      });
    }

    console.log("Sembrando categorías de carga pesada…");
    for (const [indice, categoria] of categoriasCargaPesada.entries()) {
      await prisma.categoria.upsert({
        where: {
          linea_codigo: {
            linea: LineaNegocio.CARGA_PESADA,
            codigo: categoria.id,
          },
        },
        update: {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          publicada: categoria.publicada,
          orden: indice,
          estado: "ACTIVO",
        },
        create: {
          linea: LineaNegocio.CARGA_PESADA,
          codigo: categoria.id,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          publicada: categoria.publicada,
          orden: indice,
          estado: "ACTIVO",
        },
      });
    }

    console.log("Sembrando productos industriales de muestra…");
    let creados = 0;
    for (const producto of productosIndustrialesMuestra) {
      const categoriaId = mapaCategorias.get(producto.categoriaId);
      if (!categoriaId) continue;

      await prisma.producto.upsert({
        where: { codigo: producto.codigo },
        update: {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          linea: LineaNegocio.INDUSTRIAL,
          categoriaId,
          modelo: producto.modelo ?? null,
          subcategoria: producto.subcategoria ?? null,
          aplicacion: producto.aplicacion ?? null,
          especificaciones: producto.especificaciones ?? undefined,
          destacado: producto.destacado ?? false,
          visibleWeb: true,
          estado: "ACTIVO",
        },
        create: {
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          linea: LineaNegocio.INDUSTRIAL,
          categoriaId,
          modelo: producto.modelo ?? null,
          subcategoria: producto.subcategoria ?? null,
          aplicacion: producto.aplicacion ?? null,
          especificaciones: producto.especificaciones ?? undefined,
          destacado: producto.destacado ?? false,
          visibleWeb: true,
          estado: "ACTIVO",
        },
      });
      creados += 1;
    }

    console.log(
      `Seed listo. Admin: ${USUARIO_ADMIN} · productos industriales: ${creados}`,
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
