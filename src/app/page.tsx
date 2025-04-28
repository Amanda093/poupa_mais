"use client";

import Image from "next/image";
import React, { useState } from "react";

import {
  Button,
  ExpenseForm,
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

export default function Home() {
  const estadosOrdenados = Object.entries(codigosEstadosIBGE).sort((a, b) =>
    a[1].localeCompare(b[1]),
  );
  const primeiroEstadoKey = estadosOrdenados[0][0];

  const [estadoSelecionado, setEstadoSelecionado] =
    useState<string>(primeiroEstadoKey);

  const [custeio, setCusteio] = useState<Custeio>({
    renda: "",
    gastos: [{ nome: "", valor: "" }],
    estado: Number(estadosOrdenados[0][0]),
  });
  const handleChangeRenda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCusteio({ ...custeio, renda: e.target.value });
  };

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
                id="regiao-select"
                className="flex flex-col items-center rounded-lg border bg-gray-50 p-4"
                value={estadoSelecionado}
                onChange={(e) => {
                  const novoEstado = Number(e.target.value);
                  setEstadoSelecionado(e.target.value);
                  setCusteio((prev) => ({
                    ...prev,
                    estado: novoEstado,
                  }));
                }}
              >
                <SelectTrigger className="w-[280px]" variant="background">
                  <SelectValue placeholder="Select a timezone" />
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

      {/* Formulário 02 */}
      <ExpenseForm />

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
