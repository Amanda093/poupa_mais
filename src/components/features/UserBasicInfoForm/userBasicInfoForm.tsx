"use client";

import React, { useState } from "react";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { codigosEstadosIBGE } from "@/context";
import { Custeio } from "@/interface";

const UserBasicInfoForm = () => {
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
        <p className="text-light">Esse é o total que você recebe por mês.</p>
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
            <SelectTrigger className="w-[280px]">
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

          {/*TODO: trocar esse input por um select ou um input com pesquisa */}
          <Input
            type="text"
            id="state"
            placeholder="Ex: São Paulo"
            variant="background"
          />
        </div>
        <p className="text-light">
          Isso nos ajuda a gerar planejamentos mais precisos
        </p>
      </div>
    </div>
  );
};

export { UserBasicInfoForm };
