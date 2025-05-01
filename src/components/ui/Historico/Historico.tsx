import React from "react";

interface HistoricoProps {
  mes: string;
  ano: string;
  despesas: { cor: string; valor: number; titulo: string }[];
}

const Historico = (props: HistoricoProps) => {
  const { mes, ano, despesas } = props;

  return (
    <div>
      {/* Título */}
      <div className="flex items-center gap-[1em]">
        <h2 className="font-bold text-nowrap text-emerald-500">
          {mes} - {ano}
        </h2>
        <div className="color-emerald-500 h-[0.15em] w-[100%] rounded-[0.25em] bg-emerald-500" />
      </div>

      {/* Gráfico */}
      <div className="flex h-[30%] w-full justify-end overflow-hidden rounded-[0.5em] outline-[0.15em] outline-white">
        {despesas.map((despesa, index) => (
          <div
            key={index}
            className={`flex h-full w-[${100 / despesas.length}%] items-center justify-center ${despesa.cor} text-white outline-[0.15em] outline-white`}
            title={despesa.titulo}
          >
            {`R$ ${despesa.valor.toFixed(2)}`}
          </div>
        ))}
      </div>

      {/* Legendas */}
      <div className="mt-2 flex gap-3">
        {despesas.map((despesa, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Cor */}
            <div className="h-4 w-4 rounded-xs" style={{ backgroundColor: despesa.cor }}></div>
            {despesa.titulo}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Historico };
