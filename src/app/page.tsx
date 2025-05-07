"use client";

/*TODO: Comentar o código Miguel
  TODO: Organizar o código Amanda Ni - organizamos o cadastro e login, inicial, faq
  */

import { CheckedState } from "@radix-ui/react-checkbox";
import { differenceInDays, set } from "date-fns";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiSparkles } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import ReactMarkdown from "react-markdown";

import {
  Button,
  Checkbox,
  Footer,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Title,
  Spinner,
} from "@/components";
import { categorias, codigosEstadosIBGE } from "@/context";
import { useChatbot } from "@/hooks";
import { db, auth } from "@/lib/services";
import {
  addGasto,
  handleChangeGastos,
  handleFormIA,
  handleChangeRenda,
  removeGasto,
  handleChangeEstado,
  handleChangeObs,
  handleChangeUtilizavel,
} from "@/lib/handlers";
import { Custeio } from "@/types";
import { verificarLimite, verificarSePlanejamentoAnterior } from "@/lib/utils";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  console.log("Loading: ", loading, "|", "Current user: ", user?.email);
  const [limitado, setLimitado] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [mostrarCheck, setMostrarCheck] = useState(false);
  const planejamentoRef = useRef<HTMLDivElement>(null);
  const { mensagemBot, sendMensagem } = useChatbot();

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
    utilizavel: false,
  });

  // verifica se o usuário anônimo já usou o serviço anteriormente e limita novo uso
  useEffect(() => {
    if (!user && !loading) {
      const usado = localStorage.getItem("usouGeracao");
      if (usado === "true") {
        setLimitado(true);
      }
    }
  }, [loading, user]);

  // limita usuários autenticados a 3 usos por semana, resetando após 7 dias
  useEffect(() => {
    verificarLimite(user, setLimitado);
  }, [user]);

  // Verifica se o usuário já possui um planejamento anterior e exibe a checkbox
  useEffect(() => {
    verificarSePlanejamentoAnterior(user, setMostrarCheck);
  }, [user]);

  return (
    <div className="pb-[5em]">
      <div className="container mx-auto py-[60px] xl:!max-w-[1270px]">
        <div className="max-lg:text-center">
          <Title
            mainTitle="Controle seus gastos."
            subTitle="Planeje seu futuro."
          />
        </div>

        {/* Formulário - Parte 01 */}
        <div className="d:gap-[0.5em] flex gap-[2em] max-lg:justify-center max-md:flex-col max-md:items-center">
          {/* Renda Mensal */}
          <div className="min-w-[20em] max-md:w-[80%] max-md:min-w-auto">
            <label htmlFor="monthpay">Qual sua renda mensal?</label>
            <Input
              id="monthpay"
              type="money"
              placeholder="R$ 0,00"
              variant="background"
              value={custeio.renda}
              onChange={(e) => handleChangeRenda(e.target.value, setCusteio)}
            />

            <p className="text-light">
              Esse é o total que você recebe por mês.
            </p>
          </div>

          {/* Onde Você Mora */}
          <div className="min-w-[20em] max-md:w-[80%] max-md:min-w-auto">
            <label htmlFor="state">
              Selecione a região mais perto de sua residência:
            </label>
            <Select
              value={estadoSelecionado}
              onValueChange={(value) =>
                handleChangeEstado(value, setEstadoSelecionado, setCusteio)
              }
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
            <p className="text-light">
              Isso nos ajuda a gerar planejamentos mais precisos.
            </p>
          </div>
        </div>
      </div>

      {/* Formulário - Parte 02 */}
      <div className="relative container mx-auto xl:!max-w-[1300px]">
        {limitado && !mensagemBot && (
          <div className="text-bold form-shadow absolute top-[50%] left-0 z-10 flex w-full translate-y-[-50%] flex-col justify-center gap-[0.25em] rounded-[1em] bg-white py-[1.5em] text-center">
            {user ? (
              <>
                <h1>Espera aí!</h1>
                <h2 className="text-emerald-500">
                  Limite semanal atingido. Tente novamente mais tarde!
                </h2>
              </>
            ) : (
              <>
                <h1>Gostou do site?</h1>
                <h2 className="text-emerald-500">
                  Cadastre-se para usar o serviço novamente
                </h2>
                <div className="mt-[1em] flex justify-center gap-[1em]">
                  <Button variant="default" asChild>
                    <Link href="/cadastro" className="">
                      Cadastrar-se
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login" className="">
                      Login
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
        <div
          className={`form-shadow flex w-full flex-col gap-[35px] rounded-[1em] !px-[1.2em] py-[1.5em] transition-[height] ${limitado && !mensagemBot && "pointer-events-none relative z-1 blur-xs select-none"}`}
        >
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
                className="flex items-end justify-center gap-[2.5%] max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:gap-[.75em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: "0.3" }}
              >
                <div className="w-[30%] max-sm:w-[80%]">
                  <label>Despesa</label>
                  <Input
                    type="text"
                    value={gasto.nome}
                    placeholder={`Gasto ${index + 1}`}
                    variant="default"
                    onChange={(e) => {
                      handleChangeGastos(
                        index,
                        "nome",
                        e.target.value,
                        setCusteio,
                      );
                    }}
                  />
                </div>
                <div className="w-[30%] max-sm:w-[80%]">
                  <label>Gasto Mensal</label>
                  <Input
                    type="money"
                    value={gasto.valor}
                    placeholder="R$ 0,00"
                    variant="default"
                    onChange={(e) => {
                      handleChangeGastos(
                        index,
                        "valor",
                        e.target.value,
                        setCusteio,
                      );
                    }}
                  />
                </div>
                <div className="w-[30%] max-sm:w-[80%]">
                  <label>Categoria</label>
                  <Select
                    value={gasto.categoria}
                    onValueChange={(value) =>
                      handleChangeGastos(index, "categoria", value, setCusteio)
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
                <div className="max-sm:mt-2">
                  <Button
                    onClick={() => removeGasto(index, setCusteio)}
                    className="aspect-square w-[2em] !p-0 max-sm:h-[2em] max-sm:w-[6em]"
                    variant="delete"
                  >
                    <MdDelete className="size-[1.25em]" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            onClick={() => addGasto(setCusteio)}
            variant="outline"
            className="mx-auto w-fit"
          >
            <IoMdAdd className="size-[1.35em]" />
            Adicionar Despesa
          </Button>

          <div className="w-full">
            <label>Observações</label>
            <Textarea
              placeholder="Ex: Quero guardar dinheiro para viajar, tenho dívidas, ou preciso de ajuda com prioridades..."
              className="min-h-[8em]"
              value={custeio.obs}
              onChange={(e) => {
                handleChangeObs(e.target.value, setCusteio);
              }}
            />
          </div>
          {user && mostrarCheck && (
            <>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={custeio.utilizavel}
                  onCheckedChange={(val) =>
                    handleChangeUtilizavel(val, setCusteio)
                  }
                />
                <label htmlFor="remember" className="">
                  Usar planejamentos anteriores como base para o novo
                </label>
              </div>
            </>
          )}
        </div>
      </div>
      {!limitado &&
        (!mensagemBot ? (
          <>
            <div className="container mx-auto flex max-w-[1270px] flex-col items-center gap-[20px] py-[60px] text-center">
              <div>
                <h2>Terminou?</h2>
                <p>Agora nós entramos em ação!</p>
              </div>
              <div className="flex justify-center">
                {gerando ? (
                  <Button disabled variant="default">
                    <Spinner />
                    Gerando planejamento...
                  </Button>
                ) : (
                  <Button
                    className="w-fit px-[0.75em]"
                    onClick={() =>
                      handleFormIA({
                        custeio,
                        user,
                        sendMensagem,
                        setGerando,
                        planejamentoRef,
                      })
                    }
                  >
                    <HiSparkles />
                    Gerar Planejamento
                  </Button>
                )}
              </div>
            </div>
            {/* Footer */}
            <Footer renda={custeio.renda} gastos={custeio.gastos} />
          </>
        ) : (
          <>
            <Fade
              delay={200} // Wait before starting
              duration={1000} // Animation duration
              fraction={0.5} // Trigger when 50% visible
              triggerOnce // Animate only once
            >
              <div
                ref={planejamentoRef}
                className="container flex flex-col items-center gap-[1em] py-[2.5em] xl:!max-w-[1270px]"
              >
                <h2 className="flex w-full items-center gap-[0.25em] text-emerald-500">
                  <HiSparkles />
                  Planejamento
                </h2>
                <div className="prose prose-sm text-light text-ia w-full max-w-none">
                  <ReactMarkdown>{mensagemBot}</ReactMarkdown>
                </div>

                {loading ? null : user ? (
                  <>
                    {/*Fazer funcionalidade de salvar planejamento */}
                    <div className="flex justify-center gap-[1em]">
                      <Button variant="default" asChild>
                        <Link href="/historico" className="">
                          Histórico de planejamentos
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        Novo planejamento
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Title mainTitle="Se interessou?" subTitle="Faça parte " />
                    <div className="flex justify-center gap-[1em]">
                      <Button variant="default" asChild>
                        <Link href="/cadastro" className="">
                          Cadastrar-se
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/login" className="">
                          Login
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Fade>
            {/* Footer */}
            <Footer renda="" gastos={custeio.gastos} />
          </>
        ))}
    </div>
  );
}
