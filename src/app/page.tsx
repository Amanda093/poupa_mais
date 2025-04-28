import Image from "next/image";

import { Button, ExpenseForm, Footer, Input, Title } from "@/components";

import IA from "../../public/IA.png";

export default function Home() {
  return (
    <div>
      <div className="container mx-auto !max-w-[1270px] py-[60px]">
        <Title
          mainTitle="Controle seus gastos."
          subTitle="Planeje seu futuro."
        />

        <div className="flex gap-[1%]">
          <div className="flex w-[33%] flex-col gap-4">
            <div className="max-w-[400px]">
              <p>Qual sua renda mensal?</p>
              <Input type="money" placeholder="R$ 0,00" variant="background" />
            </div>
            <p className="text-light">
              Esse é o total que você recebe por mês.
            </p>
          </div>
          <div className="flex w-[33%] flex-col gap-4">
            <div className="max-w-[400px]">
              <p>Onde você mora?</p>
              {/*TODO: trocar esse input por um select ou um input com pesquisa */}
              <Input
                type="text"
                placeholder="Ex: São Paulo"
                variant="background"
              />
            </div>
            <p className="text-light">
              Isso nos ajuda a gerar planejamentos mais precisos
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
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
