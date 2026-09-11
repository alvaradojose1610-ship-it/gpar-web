import { Contenedor } from "@/componentes/interfaz/Contenedor";

const razones = [
  {
    titulo: "Dos líneas, un proveedor",
    desc: "Repuestos industriales y automotrices en el mismo catálogo.",
  },
  {
    titulo: "Inventario real",
    desc: "Lo que ves en el catálogo es lo que tenemos en almacén.",
  },
  {
    titulo: "Cotización rápida",
    desc: "Armas la lista aquí y te respondemos con precio y entrega.",
  },
  {
    titulo: "Asesoría técnica",
    desc: "Te ayudamos a identificar la pieza aunque no tengas el código.",
  },
] as const;

export function SeccionPropuestaValor() {
  return (
    <section className="seccion">
      <Contenedor>
        <h2 className="font-display text-[clamp(28px,3.4vw,38px)] font-extrabold uppercase leading-[1.05] text-gpar-ink">
          ¿Por qué comprar en GPar?
        </h2>
        <p className="mb-[30px] mt-2 text-[15.5px] text-gpar-ink-2">
          Lo mismo que le decimos a cada cliente en el mostrador.
        </p>
        <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-4">
          {razones.map((razon) => (
            <div key={razon.titulo}>
              <div className="mb-3.5 h-[3px] w-[34px] bg-gpar-orange" />
              <h3 className="mb-2 text-[16.5px] font-semibold text-gpar-ink">
                {razon.titulo}
              </h3>
              <p className="text-[14.5px] text-gpar-ink-2">{razon.desc}</p>
            </div>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}
