"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Button, Input } from "@/components";
import { codigosEstadosIBGE } from "@/context";
import { Custeio } from "@/interface";

import plus from "../assets/plus.png";

interface InterfaceExpenseForm {}

const ExpenseForm: React.FunctionComponent<InterfaceExpenseForm> = () => {
  const estadosOrdenados = Object.entries(codigosEstadosIBGE).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );
  //const primeiroEstadoKey = estadosOrdenados[0][0];

  const [custeio, setCusteio] = useState<Custeio>({
    renda: "",
    gastos: [{ nome: "", valor: "" }],
    estado: Number(estadosOrdenados[0][0]),
  });

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

  /*
  const { mensagemBot, sendMensagem } = useChatbot();

  const handleSend = () => {
    const envio: Custeio = custeio;

    sendMensagem(envio);
  };
  */

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
              placeholder={`Gasto ${index + 1}`}
              variant="default"
              onChange={(e) => {
                handleChangeGastos(index, "nome", e.target.value);
              }}
            />
          </div>
          <div className="w-[30%]">
            <label>Gasto Mensal</label>
            <Input
              type="money"
              value={gasto.valor}
              placeholder="R$ 0,00"
              variant="default"
              onChange={(e) => {
                handleChangeGastos(index, "valor", e.target.value);
              }}
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
