import Image from "next/image";

import {
  Button,
  ExpenseForm,
  Footer,
  Title,
  UserBasicInfoForm,
} from "@/components";

import IA from "../../public/IA.png";

export default function Home() {
  return (
    <div>
      <div className="container mx-auto !max-w-[1270px] py-[60px]">
        <Title
          mainTitle="Controle seus gastos."
          subTitle="Planeje seu futuro."
        />

        {/* Formulário 01 */}
        <UserBasicInfoForm />
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
