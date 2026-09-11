import { EstructuraSitio } from "@/componentes/estructura/EstructuraSitio";

export default function LayoutSitioPublico({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EstructuraSitio>{children}</EstructuraSitio>;
}
