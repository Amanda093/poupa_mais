"use client";

{
  /*TODO: Checar se todos os requisitos estão sendo compridos
  TODO: Terminar README do projeto
  TODO: Certificar responsividade geral
  TODO: Comentar o código
  TODO: Organizar o código
  TODO: Adicionar animação na troca das paginas de login/cadastro
  TODO: Arrumar data no input data
  */
}

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiSparkles } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import ReactMarkdown from "react-markdown";

import {
  Button,
  Footer,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Title,
} from "@/components";
import { categorias, codigosEstadosIBGE } from "@/context";
import { useChatbot } from "@/hooks";
import { Custeio } from "@/interface";
import { auth } from "@/lib/clientApp";
import { Popup } from "@/lib/sweetalert";

{
  /*TODO: Implementar limite de usos do site*/
}
const limitado = false;
// const ExpenseForm: React.FunctionComponent<InterfaceExpenseForm> = () => {
export default function Home() {
  const [user, loading] = useAuthState(auth);
  console.log("Loading: ", loading, "|", "Current user: ", user);

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
    setCusteio({ ...custeio, estado: Number(value) });
  };

  const handleChangeObs = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCusteio({ ...custeio, obs: e.target.value });
  };

/* Para testes
  
  const mensagemBot = `
## Plano de Economia

### 1. **Análise de Gastos**
O usuário tem uma renda mensal de **R$ 1.212,32** e gasta **R$ 200,00** com comida.  
Isso representa aproximadamente **16,5%** da sua renda mensal.

É importante notar que não há informações sobre outros gastos, como aluguel, serviços básicos, transporte, etc.  
Portanto, é fundamental que o usuário faça um levantamento detalhado de todos os seus gastos para entender melhor sua situação financeira.

### 2. **Estimativa de Economia Mensal**
Considerando que o usuário gasta **16,5%** da sua renda com comida e não há informações sobre outros gastos, vamos supor que ele gasta cerca de **70%** da sua renda com todas as despesas essenciais (comida, aluguel, serviços, transporte, etc.), o que é um percentual comum para muitas pessoas.

Isso deixaria cerca de **30%** da sua renda para economia e lazer.  
Portanto, a estimativa de economia mensal seria de aproximadamente **R$ 363,70** (30% de R$ 1.212,32).

### 3. **Sugestões de Corte de Gastos**
Sem um levantamento detalhado dos gastos, é difícil sugerir cortes específicos.  
No entanto, é sempre uma boa ideia revisar:

- Gastos com serviços que não são essenciais, como assinaturas de streaming, clubes, etc.
- Negociar preços de serviços como plano de celular, internet, etc.

### 4. **Metas**

- **Curto Prazo (até 3 meses)**: Fazer um levantamento detalhado de todos os gastos e criar um orçamento que permita aumentar a porcentagem de economia.
- **Médio Prazo (3 a 12 meses)**: Aumentar a economia mensal para pelo menos **35%** da renda, o que seria cerca de **R$ 424,62**.
- **Longo Prazo (mais de 12 meses)**: Construir uma reserva de emergência que cubra pelo menos 6 meses de despesas, o que seria aproximadamente **R$ 7.327,92** (considerando despesas mensais de cerca de **R$ 1.221,99**, que é a renda menos os 30% de economia), e começar a investir em fundos de investimento ou outros ativos que sejam adequados para o perfil de risco do usuário.

### 5. **Dicas de Investimento**
Considerando o cenário econômico brasileiro, é importante diversificar investimentos.

Boas opções incluem:

- Fundos de índice
- Tesouro Direto
- Fundos multimercado

Além disso, é fundamental ter uma **reserva de emergência** antes de começar a investir.
`;
  const { sendMensagem } = useChatbot();*/

  /*CÓDIGO REAL*/
  const { mensagemBot, sendMensagem } = useChatbot();

  const handleSend = () => {
    Popup.fire({
      html: `<div>
      <h3>Confirmar envio?</h3>
      </div> `,
      icon: "question",
      focusConfirm: false,
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        const envio: Custeio = custeio;
        sendMensagem(envio);
      }
    });
  };

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
              onChange={handleChangeRenda}
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
            <p className="text-light">
              Isso nos ajuda a gerar planejamentos mais precisos.
            </p>
          </div>
        </div>
      </div>

      {/* Formulário - Parte 02 */}
      <div className="relative container mx-auto xl:!max-w-[1300px]">
        {limitado && (
          // TODO: Mudar mensagem caso o usuario já esteja logado
          <div className="text-bold form-shadow absolute top-[50%] left-0 z-10 flex w-full translate-y-[-50%] flex-col justify-center gap-[0.25em] rounded-[1em] bg-white py-[1.5em] text-center">
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
          </div>

        )}
        <div
          className={`form-shadow flex w-full flex-col gap-[35px] rounded-[1em] !px-[1.2em] py-[1.5em] transition-[height] ${limitado && "pointer-events-none relative z-1 blur-xs select-none"}`}
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
                <Button
                  onClick={() => removeGasto(index)}
                  className="aspect-square w-[2em] !p-0"
                  variant="delete"
                >
                  <MdDelete className="size-[1.25em]" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            onClick={addGastos}
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
              onChange={handleChangeObs}
            />
          </div>
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
              <Button className="w-fit px-[0.75em]" onClick={handleSend}>
                <HiSparkles />
                Gerar Planejamento
              </Button>
            </div>
            {/* Footer */}
            <Footer renda={custeio.renda} gastos={custeio.gastos} />
          </>
        ) : (
          <>
            {/*TODO: Adicionar loading enquanto a prompt é gerada*/}
            {/*TODO: Dar Scroll para o começo da resposta quando ela for gerada*/}
            {/*TODO: Criar cookie para planejamento gerado e um botão para gerar novo ( se o usuario nao estiver limitado )*/}
            <Fade
              delay={200} // Wait before starting
              duration={1000} // Animation duration
              fraction={0.5} // Trigger when 50% visible
              triggerOnce // Animate only once
            >
              <div className="container flex flex-col items-center gap-[1em] py-[2.5em] xl:!max-w-[1270px]">
                <h2 className="flex w-full items-center gap-[0.25em] text-emerald-500">
                  <HiSparkles />
                  Planejamento
                </h2>
                <p className="prose prose-sm text-light text-ia w-full max-w-none">
                  <ReactMarkdown>{mensagemBot}</ReactMarkdown>
                </p>

                  {loading ? null : user ? (
                  <>
                  <div className="flex justify-center gap-[1em]">
                        <Button variant="default" asChild>
                          <Link href="/cadastro" className="">
                            Salvar planejamento
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/login" className="">
                          Novo planejamento
                          </Link>
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
