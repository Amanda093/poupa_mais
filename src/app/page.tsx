import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="container mx-auto max-w-[1270px] py-[50px]">
      <h1>Controle seus gastos.</h1>
      <h1 className="pb-10 text-emerald-500">Planeje seu futuro.</h1>
      <div>
        <p>Qual sua renda mensal?</p>
        <Input type="text" placeholder="Erro" variant="default" />
        <Input type="text" placeholder="Erro" variant="background" />
        <p className="text-light">
          Esse é o total que você recebe por mês. Usaremos esse valor como base
          para sugerir como usar seu dinheiro.
        </p>
      </div>
    </div>
  );
}
