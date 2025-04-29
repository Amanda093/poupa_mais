import Image from "next/image";
import Link from "next/link";

import { Banner, Button, Input } from "@/components";

import password from "../../../public/password.png";

const CadastroPage = () => {
  return (
    <div className="relative mx-auto flex h-[calc(100vh-6em)] w-screen max-w-[2000px] justify-between overflow-y-hidden">
      {/* Banner */}
      <Banner containerClassName="left-0 pr-0 p-[1em]" />

      <div className="absolute top-0 right-0 flex min-h-[calc(100vh-6em)] w-[50%] items-center justify-center max-lg:w-full">
        {/* Formulário */}
        <div className="max-h-[calc(100vh-6em)] w-full max-w-[24.5em] overflow-y-auto px-[1em] py-[2em]">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="pb-1">Cadastro</h1>
              <p className="">Sua nova forma de gerenciar suas finanças</p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col">
              {/*TODO: inserir Inputs */}
              <div className="pb-5">
                <label htmlFor="nome" className="">
                  Nome
                </label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome..."
                  variant="default"
                />
              </div>

              <div className="pb-5">
                <label htmlFor="email" className="">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  variant="default"
                />
              </div>

              <div className="pb-5">
                <label htmlFor="datadenascimento" className="">
                  Data de nascimento
                </label>
                <Input id="datadenascimento" type="date" variant="default" />
              </div>

              <div className="pb-5">
                <label className="">Senha</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  variant="default"
                  icon={
                    <Image
                      src={password}
                      alt="Ícone Senha"
                      width={20}
                      height={20}
                    />
                  }
                />
              </div>

              <div className="pb-5">
                <label className="">Confirmar senha</label>
                <Input
                  id="confirmpassword"
                  type="password"
                  placeholder="********"
                  variant="default"
                  icon={
                    <Image
                      src={password}
                      alt="Ícone Senha"
                      width={20}
                      height={20}
                    />
                  }
                />
              </div>
            </div>

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
