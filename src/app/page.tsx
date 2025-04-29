"use client";

import Image from "next/image";
import React, { useState } from "react";

import {
  Button,
  Footer,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Title,
} from "@/components";
import { codigosEstadosIBGE } from "@/context";
import { Custeio } from "@/interface";

import IA from "../../public/IA.png";
import plus from "../../public/plus.png";

// const ExpenseForm: React.FunctionComponent<InterfaceExpenseForm> = () => {
export default function Home() {
  const estadosOrdenados = Object.entries(codigosEstadosIBGE).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );
  const primeiroEstado = estadosOrdenados[0][0];

  const [estadoSelecionado, setEstadoSelecionado] =
    useState<string>(primeiroEstado);

  const [custeio, setCusteio] = useState<Custeio>({
    renda: "",
    gastos: [{ nome: "", valor: "" }],
    estado: Number(estadosOrdenados[0][0]),
    obs: "",
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

  const removeGasto = (index: number) => {
    setCusteio({
      ...custeio,
      gastos: custeio.gastos.filter((_, i) => i !== index),
    });
  };

  const handleChangeRenda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCusteio({ ...custeio, renda: e.target.value });
  };

  const handleChangeEstado = (value: string) => {
    setEstadoSelecionado(value);
  };

  /*
  const { mensagemBot, sendMensagem } = useChatbot();

  const handleSend = () => {
    const envio: Custeio = custeio;

    sendMensagem(envio);
  };
  */

  return (
    <div>
      <div className="container mx-auto !max-w-[1270px] py-[60px]">
        <Title
          mainTitle="Controle seus gastos."
          subTitle="Planeje seu futuro."
        />

        {/* Formulário - Parte 01 */}
        <div className="flex gap-[1%]">
          <div className="flex w-[33%] flex-col gap-4">
            <div className="max-w-[400px]">
              <label htmlFor="monthpay">Qual sua renda mensal?</label>
              <Input
                id="monthpay"
                type="money"
                placeholder="R$ 0,00"
                variant="background"
                value={custeio.renda}
                onChange={(e) => handleChangeRenda(e)}
              />
            </div>
            <p className="text-light">
              Esse é o total que você recebe por mês.
            </p>
          </div>
          <div className="flex w-[33%] flex-col gap-4">
            <div className="max-w-[400px]">
              <label htmlFor="state">Onde você mora?</label>
              <Select
                value={estadoSelecionado}
                onValueChange={(value) => handleChangeEstado(value)}
              >
                <SelectTrigger
                  className="flex bg-emerald-50"
                  variant="background"
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {estadosOrdenados.map(([key, value]) => (
                    <SelectItem value={key} key={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-light">
              Isso nos ajuda a gerar planejamentos mais precisos
            </p>
          </div>
        </div>
      </div>

      {/* Formulário - Parte 02 */}
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
          <div key={index} className="flex items-end justify-center gap-[2.5%]">
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
            <Button
              onClick={() => removeGasto(index)}
              variant="outline"
              className="hover:rose-glow aspect-square w-[2em] rounded-[0.5em] bg-rose-50 p-0 text-rose-500 outline-rose-500 hover:text-rose-600 hover:outline-rose-600"
            >
              X
            </Button>
          </div>
        ))}

        <Button onClick={addGastos} variant="outline" className="mx-auto w-fit">
          <Image src={plus} alt="Adicionar" />
          Adicionar Despesa
        </Button>

        {/*TODO: terminar formulário */}
      </div>

      <div className="container mx-auto flex !max-w-[1270px] flex-col items-center gap-[20px] py-[60px] text-center">
        <div>
          <h2>Terminou?</h2>
          <p>Agora nós entramos em ação!</p>
        </div>

        <Button className="w-fit">
          <Image src={IA} alt="Simbolo de IA" />
          Gerar Planejamento
        </Button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
