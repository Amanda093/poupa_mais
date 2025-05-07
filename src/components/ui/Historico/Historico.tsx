"use client";

import React, { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import ReactMarkdown from "react-markdown";

type Gasto = {
  categoria: string;
  nome: string;
  valor: string;
};

interface HistoricoProps {
  geradoEm: string;
  despesas: Gasto[];
  renda: string;
  respostaIA: string;
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const Historico = (props: HistoricoProps) => {
  const { geradoEm, despesas, renda, respostaIA } = props;
  const [expandido, setExpandido] = useState(false);
  const dataGerada = new Date(geradoEm);
  const dia = dataGerada.getDate().toString().padStart(2, "0");
  const mes = toTitleCase(
    dataGerada.toLocaleString("pt-BR", { month: "long" }),
  );
  const ano = dataGerada.getFullYear();
  const rendaNumerica = parseFloat(renda.replace(/\D/g, "")) / 100;
  const valorTotalDespesas = despesas.reduce((total, despesa) => {
    const despesaValorNumerico =
      parseFloat(despesa.valor.replace(/\D/g, "")) / 100;
    return total + despesaValorNumerico;
  }, 0);
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
      case "compras pessoais":
        return "bg-pink-400";
      case "lazer e entretenimento":
        return "bg-yellow-500";
      case "tecnologia e comunicação":
        return "bg-indigo-500";
      case "financeiro":
        return "bg-teal-500";
      case "presentes e doações":
        return "bg-rose-500";
      case "pets":
        return "bg-amber-500";
      case "manutenção e emergências":
        return "bg-cyan-500";
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
            {dia} {mes} - {ano}
          </h2>
          <div className="color-emerald-500 h-[0.15em] w-[100%] rounded-[0.25em] bg-emerald-500" />
        </div>

        {/* Gráfico */}
        <div className="max-xs:flex-col max-xs:h-auto mt-2 flex h-[2.5rem] w-full flex-row overflow-x-auto overflow-y-hidden rounded-[0.5em] bg-emerald-500 outline-[0.15em] outline-white">
          {valorRestante > 0 && (
            <div
              className="flex items-center justify-center px-[0.2em] text-[0.85em] text-nowrap text-white outline-[0.15em] outline-white max-sm:!w-full max-sm:text-[0.6em]"
              style={{
                width: `${(valorRestante / rendaNumerica) * 100}%`,
                minWidth: "fit-content",
              }}
            >
              {`R$ ${valorRestante.toFixed(2)}`}
            </div>
          )}

          {despesas.map((despesa, index) => {
            const despesaValorNumerico =
              parseFloat(despesa.valor.replace(/\D/g, "")) / 100;
            const largura = (despesaValorNumerico / rendaNumerica) * 100;
            return (
              <div
                key={index}
                className={`flex min-w-[40px] items-center justify-center px-[0.2em] text-nowrap ${getCategoriaCor(despesa.categoria)} text-[0.85em] text-white outline-[0.15em] outline-white max-sm:!w-full max-sm:text-[0.6em]`}
                style={{ width: `${largura}%`, minWidth: "fit-content" }}
                title={despesa.nome}
              >
                {`R$ ${despesaValorNumerico.toFixed(2)}`}
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
          <div className="prose prose-sm text-light text-ia w-full max-w-none">
            <ReactMarkdown>{respostaIA}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Historico };
