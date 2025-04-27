import { Footer } from "@/components/ui/footer";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div>
      <div className="container mx-auto !max-w-[1270px] py-[70px]">
        <h1>Controle seus gastos.</h1>
        <h1 className="pb-6 text-emerald-500">Planeje seu futuro.</h1>
        <div className="flex gap-[2.5%]">
          <div className="flex flex-col gap-4">
            <div className="max-w-[400px]">
              <p>Qual sua renda mensal?</p>
              <Input type="text" placeholder="R$00,00" variant="background" />
            </div>
            <p className="text-light">
              Esse é o total que você recebe por mês.
            </p>
          </div>
          <div className="flex flex-col gap-4">
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
      <Footer />
    </div>
  );
}
