"use client";

// Imports
import { LucideEye, LucideEyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // para redirecionar
import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { MdError } from "react-icons/md";

import { Banner, Button, Input } from "@/components";
import DatePicker from "@/components/ui/DatePicker/date-picker";
import { handleCadastro } from "@/lib/handlers"; // função que faz o cadastro do usuário
import { auth } from "@/lib/services";
import { verificarForcaSenha } from "@/lib/utils";

const CadastroPage = () => {
  //declara os estados utilizados nos inputs do código
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = React.useState<Date>();

  const [user, loading] = useAuthState(auth);

  //se o usuário se cadastrar com sucesso, manda pro histórico
  useEffect(() => {
    if (!loading && user !== null) {
      router.push("/historico");
    }
  }, [user, loading, router]);

  // chama a const verificar de força da senha, colocando password como seu parametro
  const forcaSenha = verificarForcaSenha(password);

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
              <div className="pb-5">
                <label htmlFor="nome" className="">
                  Nome
                </label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome..."
                  variant="default"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="pb-5">
                <label htmlFor="datadenascimento" className="">
                  Data de nascimento
                </label>
                <DatePicker
                  id="datadenascimento"
                  value={dataNascimento}
                  onChange={(d) => setDataNascimento(d)}
                />
              </div>

              <div className="pb-5">
                <label className="">Senha</label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  variant="default"
                  icon={
                    showPassword ? (
                      <LucideEye
                        className="size-[1em] cursor-pointer select-none"
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    ) : (
                      <LucideEyeClosed
                        className="size-[1em] cursor-pointer select-none"
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                    )
                  }
                />
              </div>

              <div className="pb-5">
                <label className="">Confirmar senha</label>
                <Input
                  id="password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha..."
                  variant="default"
                  icon={
                    showConfirmPassword ? (
                      <LucideEye
                        className="size-[1em] cursor-pointer select-none"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    ) : (
                      <LucideEyeClosed
                        className="size-[1em] cursor-pointer select-none"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    )
                  }
                />
              </div>

              <div>
                <p className="flex gap-[0.2em]">
                  Senha:
                  {forcaSenha === "Forte" ? (
                    <span className="flex items-center gap-1 text-emerald-500">
                      {forcaSenha}
                      <FaCheckCircle size={16} />
                    </span>
                  ) : forcaSenha === "Média" ? (
                    <span className="flex items-center gap-1 text-amber-600">
                      {forcaSenha}
                      <MdError />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      {forcaSenha}
                      <IoCloseCircle />
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Botão */}
            <Button
              variant="default"
              className="w-full"
              onClick={() =>
                //chama a função handleCadastro e manda os valores
                handleCadastro({
                  nome,
                  email,
                  password,
                  confirmpassword,
                  dataNascimento,
                  forcaSenha,
                  router,
                })
              }
            >
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
