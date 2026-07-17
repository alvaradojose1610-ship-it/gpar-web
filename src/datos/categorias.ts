import type { LucideIcon } from "lucide-react";
import {
  CircleDot,
  Cog,
  Droplets,
  Gauge,
  HardHat,
  Link2,
  Nut,
  Disc3,
  Wrench,
  Wind,
} from "lucide-react";

export type Categoria = {
  id: string;
  nombre: string;
  descripcion: string;
  href: string;
  icono: LucideIcon;
  /** Solo rutas de imágenes con calidad suficiente para web. */
  imagen?: string;
};

export const categorias: Categoria[] = [
  {
    id: "rodamientos",
    nombre: "Rodamientos",
    descripcion: "Componentes para movimiento y carga industrial.",
    href: "/#categorias",
    icono: CircleDot,
    imagen: "/assets/categorias/categoria-rodamientos.webp",
  },
  {
    id: "correas",
    nombre: "Correas",
    descripcion: "Transmisión para equipos de producción.",
    href: "/#categorias",
    icono: Link2,
  },
  {
    id: "poleas",
    nombre: "Poleas",
    descripcion: "Sistemas de transmisión y acoplamiento.",
    href: "/#categorias",
    icono: Disc3,
  },
  {
    id: "motores",
    nombre: "Motores",
    descripcion: "Impulso para operaciones industriales.",
    href: "/#categorias",
    icono: Cog,
  },
  {
    id: "herramientas",
    nombre: "Herramientas",
    descripcion: "Equipamiento para mantenimiento y taller.",
    href: "/#categorias",
    icono: Wrench,
  },
  {
    id: "lubricantes",
    nombre: "Lubricantes",
    descripcion: "Cuidado y rendimiento de equipos.",
    href: "/#categorias",
    icono: Droplets,
  },
  {
    id: "tornilleria",
    nombre: "Tornillería",
    descripcion: "Fijaciones y elementos de ensamble.",
    href: "/#categorias",
    icono: Nut,
  },
  {
    id: "hidraulica",
    nombre: "Hidráulica",
    descripcion: "Mangueras, conexiones y componentes.",
    href: "/#categorias",
    icono: Gauge,
  },
  {
    id: "neumatica",
    nombre: "Neumática",
    descripcion: "Componentes para aire comprimido.",
    href: "/#categorias",
    icono: Wind,
  },
  {
    id: "seguridad-industrial",
    nombre: "Seguridad industrial",
    descripcion: "Protección para personal y operación.",
    href: "/#categorias",
    icono: HardHat,
  },
];
