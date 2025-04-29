"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

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
import { categorias, codigosEstadosIBGE } from "@/context";
import { useChatbot } from "@/hooks";
import { Custeio } from "@/interface";

import IA from "../../public/IA.png";

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
    gastos: [{ nome: "", valor: "", categoria: "" }],
    estado: Number(estadosOrdenados[0][0]),
    obs: "",
  });

  const handleChangeGastos = (
    index: number,
    campo: "nome" | "valor" | "categoria",
    value: string,
  ) => {
    const novosGastos = [...custeio.gastos];
    novosGastos[index][campo] = value;
    setCusteio({ ...custeio, gastos: novosGastos });
  };

  const addGastos = () => {
    setCusteio({
      ...custeio,
      gastos: [...custeio.gastos, { nome: "", valor: "", categoria: "" }],
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

  const { mensagemBot, sendMensagem } = useChatbot();

  const handleSend = () => {
    const envio: Custeio = custeio;

    sendMensagem(envio);
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
          {/* Renda Mensal */}
          <div className="flex w-[33%] flex-col gap-4">
            <div className="max-w-[400px]">
              {/* TODO: adicionar bloqueio de letras */}
              <label htmlFor="monthpay">Qual sua renda mensal?</label>
              <Input
                id="monthpay"
                type="money"
                placeholder="R$ 0,00"
                variant="background"
                value={custeio.renda}
                onChange={handleChangeRenda}
              />
            </div>
            <p className="text-light">
              Esse é o total que você recebe por mês.
            </p>
          </div>

          {/* Onde Você Mora */}
          {/* TODO: arrumar estilo */}
          <div className="flex w-[33%] flex-col gap-4">
            <div className="max-w-[400px]">
              <label htmlFor="state">
                Selecione a região mais perto de sua residência:
              </label>
              <Select
                value={estadoSelecionado}
                onValueChange={(value) => handleChangeEstado(value)}
              >
                <SelectTrigger className="flex" variant="background">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent variant="background">
                  {estadosOrdenados.map(([key, value]) => (
                    <SelectItem variant="background" value={key} key={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-light">
              Isso nos ajuda a gerar planejamentos mais precisos.
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
        <AnimatePresence>
          {custeio.gastos.map((gasto, index) => (
            <motion.div
              key={index}
              className="flex items-end justify-center gap-[2.5%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: "0.3" }}
            >
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
                {/* TODO: adicionar bloqueio de letras */}
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
                <Select
                  value={gasto.categoria}
                  onValueChange={(value) =>
                    handleChangeGastos(index, "categoria", value)
                  }
                >
                  <SelectTrigger className="flex" variant="default">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>

                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem value={categoria} key={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => removeGasto(index)} variant="delete">
                <MdDelete className="size-[1.25em]" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button onClick={addGastos} variant="outline" className="mx-auto w-fit">
          <IoMdAdd className="size-[1.35em]" />
          Adicionar Despesa
        </Button>

        {/*TODO: terminar formulário */}
      </div>

      <div className="container mx-auto flex !max-w-[1270px] flex-col items-center gap-[20px] py-[60px] text-center">
        <div>
          <h2>Terminou?</h2>
          <p>Agora nós entramos em ação!</p>
        </div>

        <Button className="w-fit px-[0.75em]" onClick={handleSend}>
          <Image src={IA} alt="Simbolo de IA" />
          Gerar Planejamento
        </Button>
      </div>
      <div className="py-5em">{mensagemBot}</div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
