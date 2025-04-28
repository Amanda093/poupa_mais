"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Button, Input } from "@/components";

import plus from "../assets/plus.png";

{
  /*TODO: adicionar estes arquivos as suas respectivas pastas*/
}
interface Gasto {
  nome: string;
  valor: string;
}

interface Custeio {
  renda: string;
  gastos: Gasto[];
  estado: number;
}

interface InterfaceExpenseForm {}

const ExpenseForm: React.FunctionComponent<InterfaceExpenseForm> = () => {
  const codigosEstadosIBGE: Record<number, string> = {
    11: "RO",
    12: "AC",
    13: "AM",
    14: "RR",
    15: "PA",
    16: "AP",
    17: "TO",
    21: "MA",
    22: "PI",
    23: "CE",
    24: "RN",
    25: "PB",
    26: "PE",
    27: "AL",
    28: "SE",
    29: "BA",
    31: "MG",
    32: "ES",
    33: "RJ",
    35: "SP",
    41: "PR",
    42: "SC",
    43: "RS",
    50: "MS",
    51: "MT",
    52: "GO",
    53: "DF",
  };

  const estadosOrdenados = Object.entries(codigosEstadosIBGE).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );
  const primeiroEstadoKey = estadosOrdenados[0][0];

  const [custeio, setCusteio] = useState<Custeio>({
    renda: "",
    gastos: [{ nome: "", valor: "" }],
    estado: Number(estadosOrdenados[0][0]),
  });

  const handleChangeRenda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCusteio({ ...custeio, renda: e.target.value });
  };

  const handleChangeGastos = (
    index: number,
    campo: "nome" | "valor",
    value: string,
  ) => {
    const novosGastos = [...custeio.gastos];
    novosGastos[index][campo] = value;
    setCusteio({ ...custeio, gastos: novosGastos });
  };

  const addGastos = () => {
    setCusteio({
      ...custeio,
      gastos: [...custeio.gastos, { nome: "", valor: "" }],
    });
  };

  return (
    <div className="form-shadow container mx-auto flex !max-w-[1300px] flex-col gap-[35px] rounded-[1em] !px-[1.2em] py-[1.5em]">
      <div>
        <p>Quais são suas despesas?</p>
        <p className="text-light">
          Adicione aqui suas despesas fixas, como aluguel, conta de luz,
          internet ou transporte.
        </p>
      </div>

      {/* Inputs */}
      {custeio.gastos.map((gasto, index) => (
        <div key={index} className="flex gap-[2.5%]">
          <div className="w-[30%]">
            <label>Despesa</label>
            <Input
              type="text"
              value={gasto.nome}
              placeholder="Ex: Conta de luz"
              variant="default"
            />
          </div>
          <div className="w-[30%]">
            <label>Gasto Mensal</label>
            <Input
              type="money"
              value={gasto.valor}
              placeholder="R$ 0,00"
              variant="default"
            />
          </div>
          <div className="w-[30%]">
            <label>Categoria</label>
            {/*TODO: trocar esse input por um select ou um input com pesquisa */}
            <Input type="text" placeholder="Contas" variant="default" />
          </div>
        </div>
      ))}

      <Button onClick={addGastos} variant="outline" className="mx-auto w-fit">
        <Image src={plus} alt="Adicionar" />
        Adicionar Despesa
      </Button>

      {/*TODO: terminar formulário */}
    </div>
  );
};

export { ExpenseForm };
