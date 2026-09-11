type Props = {
  titulo: string;
  descripcion: string;
  children?: React.ReactNode;
};

export function PaginaPlaceholderPanel({
  titulo,
  descripcion,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1D2430] sm:text-3xl">
        {titulo}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[#5C6675] sm:text-base">
        {descripcion}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
