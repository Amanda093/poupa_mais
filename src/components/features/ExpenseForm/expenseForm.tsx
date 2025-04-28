import Image from "next/image";

import { Button, Input } from "@/components";

import plus from "../assets/plus.png";

const ExpenseForm = () => {
  return (
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
          <Input type="text" placeholder="Ex: Conta de luz" variant="default" />
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
  );
};

export { ExpenseForm };
