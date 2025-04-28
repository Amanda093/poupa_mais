import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import banner from "../../../public/banner.png";

const LoginPage = () => {
  return (
    <div className="container mx-auto flex max-w-[1270px] items-center justify-between py-[60px]">
      {/* Formulário */}
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="pb-1">Login</h1>
          <p className="">Bem-vindo de volta!</p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col">
          <div className="">
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

          <div className="py-5">
            <label className="">Senha</label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              variant="default"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="size-4 rounded border border-gray-300"
            />
            <label htmlFor="remember" className="">
              Mantenha-me conectado
            </label>
          </div>
        </div>

        {/* Botão */}
        <Button variant="default" className="w-full">
          Logar
        </Button>

        {/* Cadastro */}
        <p className="">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-emerald-500 hover:underline">
            Cadastrar
          </Link>
        </p>
      </div>

      {/* Banner */}
      <div className="">
        <Image src={banner} alt="Banner" width={850} />
      </div>
    </div>
  );
};

export default LoginPage;
