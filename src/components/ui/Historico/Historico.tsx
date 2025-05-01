"use client";

import React, { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";

interface HistoricoProps {
  mes: string;
  ano: string;
  despesas: { categoria: string; valor: number; nome: string }[];
  renda: string;
  respostaIA: string;
}

const Historico = (props: HistoricoProps) => {
  const { mes, ano, despesas, renda, respostaIA } = props;
  const [expandido, setExpandido] = useState(false);

  const rendaNumerica = parseFloat(renda.replace(/\D/g, "")) / 100;
  const valorTotalDespesas = despesas.reduce(
    (total, despesa) => total + despesa.valor,
    0,
  );
  const valorRestante = rendaNumerica - valorTotalDespesas;

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
        return "bg-gray-400";
    }
  };

  return (
    <div className="pb-[1em]">
      <div
        className="cursor-pointer"
        onClick={() => setExpandido(!expandido)}
        title="Clique para ver mais informações"
      >
        {/* Título */}
        <div className="flex items-center gap-[1em]">
          <h2 className="flex items-center gap-[0.15em] font-bold text-nowrap text-emerald-500">
            <IoIosArrowForward
              className={`transition-all duration-300 ease-in-out ${
                expandido ? "rotate-90" : "rotate-0"
              }`}
            />
            {mes} - {ano}
          </h2>
          <div className="color-emerald-500 h-[0.15em] w-[100%] rounded-[0.25em] bg-emerald-500" />
        </div>

        {/* Gráfico */}
        <div className="max-xs:flex-col max-xs:h-auto mt-2 flex h-[2.5rem] w-full flex-row overflow-x-auto overflow-y-hidden rounded-[0.5em] bg-emerald-500 outline-[0.15em] outline-white">
          {valorRestante > 0 && (
            <div
              className="flex min-w-[40px] items-center justify-center text-[0.85em] text-white outline-[0.15em] outline-white max-sm:!w-full max-sm:text-[0.6em]"
              style={{ width: `${(valorRestante / rendaNumerica) * 100}%` }}
            >
              {`R$ ${valorRestante.toFixed(2)}`}
            </div>
          )}

          {despesas.map((despesa, index) => {
            const largura = (despesa.valor / rendaNumerica) * 100;
            return (
              <div
                key={index}
                className={`flex min-w-[40px] items-center justify-center ${getCategoriaCor(despesa.categoria)} text-[0.85em] text-white outline-[0.15em] outline-white max-sm:!w-full max-sm:text-[0.6em]`}
                style={{ width: `${largura}%` }}
                title={despesa.nome}
              >
                {`R$ ${despesa.valor.toFixed(2)}`}
              </div>
            );
          })}
        </div>

        {/* Legendas */}
        <div className="mt-2 flex flex-wrap gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-xs bg-emerald-500"></div>
            Valor Restante
          </div>
          {despesas.map((despesa, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`h-4 w-4 rounded-xs ${getCategoriaCor(despesa.categoria)}`}
              ></div>
              {despesa.nome}
            </div>
          ))}
        </div>
      </div>
      {/* Texto Expandível */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expandido ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
        } overflow-hidden`}
      >
        <div className="overflow-hidden">
          <h3 className="mb- flex items-center gap-[0.2em] text-emerald-500">
            <HiSparkles />
            Resposta
          </h3>
          <p className="text-light">{respostaIA}</p>
        </div>
      </div>
    </div>
  );
};

export { Historico };
