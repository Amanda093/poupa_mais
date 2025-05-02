"use client";

import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { LucideEye, LucideEyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Banner, Button, Checkbox, Input } from "@/components";
import { auth } from "@/lib/clientApp";
import { Toast } from "@/lib/sweetalert";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await setPersistence(
        auth,
        lembrar ? browserLocalPersistence : browserSessionPersistence,
      );
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      console.log("Usuário logado:", userCredential.user);
      router.push("/historico");
      Toast.fire({
        title: "Login realizado com sucesso!",
        icon: "success",
      });
    } catch (error) {
      Toast.fire({
        title: `Erro no login:, ${error}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="relative mx-auto flex h-[calc(100vh-6em)] w-screen max-w-[2000px] justify-between overflow-y-hidden">
      <div className="absolute top-0 left-0 flex min-h-[calc(100vh-6em)] w-[50%] items-center justify-center max-lg:w-full">
        {/* Formulário */}
        <div className="max-h-[calc(100vh-6em)] w-full max-w-[24.5em] overflow-y-auto px-[1em] py-[2em]">
          <div className="flex w-full flex-col gap-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="py-5">
                <label className="">Senha</label>
                <Input
                  id="password"
                  type={showSenha ? "text" : "password"}
                  placeholder="Digite sua senha..."
                  variant="default"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  icon={
                    showSenha ? (
                      <LucideEye
                        className="size-[1em] cursor-pointer select-none"
                        onClick={() => setShowSenha((prev) => !prev)}
                      />
                    ) : (
                      <LucideEyeClosed
                        className="size-[1em] cursor-pointer select-none"
                        onClick={() => setShowSenha((prev) => !prev)}
                      />
                    )
                  }
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={lembrar}
                  onCheckedChange={(val) => setLembrar(!!val)}
                />
                <label htmlFor="remember" className="">
                  Mantenha-me conectado
                </label>
              </div>
            </div>

            {/* Botão */}
            <Button variant="default" className="w-full" onClick={handleLogin}>
              Logar
            </Button>

            {/* Cadastro */}
            <p className="flex gap-[0.25em]">
              Não tem uma conta?
              <Link
                href="/cadastro"
                className="text-emerald-500 hover:underline"
              >
                Cadastrar
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Banner */}
      <Banner containerClassName=" right-0 pl-0" />
    </div>
  );
};

export default LoginPage;
