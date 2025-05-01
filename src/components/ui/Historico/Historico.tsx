import React from "react";

interface HistoricoProps {
  mes: string;
  ano: string;
  despesas: { categoria: string; valor: number; nome: string }[];
  renda: string;
}

const Historico = (props: HistoricoProps) => {
  const { mes, ano, despesas, renda } = props;

  const rendaNumerica = parseFloat(renda.replace(/\D/g, "")) / 100;

  const getCategoriaCor = (categoria: string): string => {
    switch (categoria.toLowerCase()) {
      case "moradia":
        return "bg-blue-500";
      case "alimentação":
        return "bg-green-500";
      case "transporte":
        return "bg-orange-500";
      case "saúde":
        return "bg-red-500";
      case "educação":
        return "bg-purple-500";
      case "lazer":
        return "bg-pink-500";
      case "outros":
        return "bg-gray-400";
      default:
        return "bg-gray-400"; // categoria indefinida
    }
  };

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
      <div className="flex h-[30%] w-full justify-end overflow-hidden rounded-[0.5em] bg-emerald-500 outline-[0.15em] outline-white">
        {despesas.map((despesa, index) => {
          const largura = (despesa.valor / rendaNumerica) * 100;
          return (
            <div
              key={index}
              className={`flex h-full items-center justify-center ${getCategoriaCor(despesa.categoria)} text-white outline-[0.15em] outline-white`}
              style={{
                width: `${largura}%`,
              }}
              title={despesa.nome}
            >
              {`R$ ${despesa.valor.toFixed(2)}`}
            </div>
          );
        })}
      </div>

      {/* Legendas */}
      <div className="mt-2 flex gap-3">
        <div className="flex items-center gap-2">
          {/* Cor */}
          <div className={`h-4 w-4 rounded-xs bg-emerald-500`}></div>
          Valor Restante
        </div>
        {despesas.map((despesa, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Cor */}
            <div
              className={`h-4 w-4 rounded-xs ${getCategoriaCor(despesa.categoria)}`}
            ></div>
            {despesa.nome}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Historico };
