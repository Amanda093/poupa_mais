import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components";

import banner from "../../../public/banner.png";

const CadastroPage = () => {
  return (
    <div className="relative mx-auto flex h-[calc(100vh-6em)] w-screen max-w-[2000px] justify-between overflow-y-hidden">
      {/* Banner */}
      <div className="absolute top-0 left-0 h-full w-[50%] p-[1em] pr-0 max-lg:hidden">
        <div className="flex size-full items-center justify-center rounded-[2em] bg-gray-950 px-[12.5%] py-[5%]">
          <Image
            src={banner}
            className="max-h-full max-w-full object-scale-down"
            alt="Banner"
          />
        </div>
      </div>
      <div className="absolute top-0 right-0 flex min-h-[calc(100vh-6em)] w-[50%] items-center justify-center max-lg:w-full">
        {/* Formulário */}
        <div className="max-h-[calc(100vh-6em)] w-full max-w-[24.5em] overflow-y-auto px-[1em] py-[2em]">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="pb-1">Cadastro</h1>
              <p className="">Sua nova forma de gerenciar suas finanças</p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col">{/*TODO: inserir Inputs */}</div>

            {/* Botão */}
            <Button variant="default" className="w-full">
              Cadastrar-se
            </Button>

            {/* Cadastro */}
            <p className="flex gap-[0.25em]">
              Já tem uma conta?
              <Link href="/login" className="text-emerald-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPage;
