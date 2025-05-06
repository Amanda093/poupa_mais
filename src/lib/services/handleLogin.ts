// lib/firebase/handleLogin.ts
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { auth } from "@/lib/services";
import { Toast } from "@/lib/utils";

interface HandleLoginProps {
  email: string;
  senha: string;
  lembrar: boolean;
  router: AppRouterInstance;
}

export const handleLogin = async ({
  email,
  senha,
  lembrar,
  router,
}: HandleLoginProps) => {
  try {
    await setPersistence(
      auth,
      lembrar ? browserLocalPersistence : browserSessionPersistence,
    );

    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log("Usuário logado:", userCredential.user);

    // quando o usuário logar, é redirecionado a página historico
    router.push("/historico");

    Toast.fire({
      title: "Login realizado com sucesso!",
      icon: "success",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro no login:", error);
    Toast.fire({
      title: `Erro no login: ${error.message || error}`,
      icon: "error",
    });
  }
};
