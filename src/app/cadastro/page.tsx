"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // para redirecionar
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { MdError } from "react-icons/md";

import { Banner, Button, Input } from "@/components";
import password_png from "@/components/assets/password.png";
import { auth } from "@/lib/clientApp";
import { db } from "@/lib/clientApp";
import { Toast } from "@/lib/sweetalert";

const CadastroPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");

  // verifica se a senha sugerida pelo usuário é forte
  const verificarForcaSenha = (senha: string): string => {
    const temMinuscula = /[a-z]/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[^A-Za-z0-9]/.test(senha);

    const requisitos = [
      temMinuscula,
      temMaiuscula,
      temNumero,
      temEspecial,
    ].filter(Boolean).length;

    if (senha.length < 6) {
      return "Fraca";
    }
    if (requisitos === 2 || requisitos === 3) {
      return "Média";
    }
    if (requisitos === 4) {
      return "Forte";
    }
    return "Fraca";
  };

  // chama a const verificar de força da senha, colocando password como seu parametro
  const forcaSenha = verificarForcaSenha(password);

  const handleCadastro = async () => {
    if (password !== confirmpassword) {
      Toast.fire({
        icon: "warning",
        title: "As senhas não coincidem.",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome,
        email,
        dataNascimento: new Date(
          (
            document.getElementById("datadenascimento") as HTMLInputElement
          )?.value,
        ),
        criadoEm: new Date(),
      });
      // Redirecionar para dashboard
      router.push("/");

      Toast.fire({
        title: "Cadastro realizado com sucesso!",
        icon: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      Toast.fire({
        title: error.message,
        icon: "success",
      });
    }
  };

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
                <Input id="datadenascimento" type="date" variant="default" />
              </div>

              {/*TODO: Fazer com que o password possa ser visualizado */}
              <div className="pb-5">
                <label className="">Senha</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  variant="default"
                  icon={
                    <Image
                      src={password_png}
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
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha..."
                  variant="default"
                  icon={
                    <Image
                      src={password_png}
                      alt="Ícone Senha"
                      width={20}
                      height={20}
                    />
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
              onClick={handleCadastro}
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
