import Image from "next/image";

import { Button, Footer, Input, Title } from "@/components";

import IA from "../../public/IA.png";
import plus from "../../public/plus.png";

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
      <div className="form-shadow container mx-auto flex !max-w-[1300px] flex-col gap-[35px] rounded-[1em] !px-[1.2em] py-[1.5em]">
        <div>
          <p>Quais são suas despesas?</p>
          <p className="text-light">
            Adicione aqui suas despesas fixas, como aluguel, conta de luz,
            internet ou transporte.
          </p>
        </div>
        <div className="flex gap-[2.5%]">
          <div className="w-[30%]">
            <p>Despesa</p>
            <Input
              type="text"
              placeholder="Ex: Conta de luz"
              variant="default"
            />
          </div>
          <div className="w-[30%]">
            <p>Gasto Mensal</p>
            <Input type="money" placeholder="R$ 0,00" variant="default" />
          </div>
          <div className="w-[30%]">
            <p>Categoria</p>
            {/*TODO: trocar esse input por um select ou um input com pesquisa */}
            <Input type="text" placeholder="Contas" variant="default" />
          </div>
        </div>

        <Button variant="outline" className="mx-auto w-fit">
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
