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
      // se o usuário quiser se manter conectado, utiliza este setPersistence
      auth,
      lembrar ? browserLocalPersistence : browserSessionPersistence,
    );

    // função que loga o usuário com email e senha
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);

    // quando o usuário logar, é redirecionado a página historico

    if (userCredential) {
      router.push("/historico");

      Toast.fire({
        title: "Login realizado com sucesso!",
        icon: "success",
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorCode = error.code;
    if (errorCode === "auth/invalid-email") {
      Toast.fire({
        title: "Email Inválido",
        icon: "warning",
      });
    } else if (errorCode === "auth/invalid-credential") {
      Toast.fire({
        title: "Senha ou email incorretos",
        icon: "warning",
      });
    } else {
      console.error("Erro no login:", error);
      Toast.fire({
        title: `Erro no login: ${error.message || error}`,
        icon: "error",
      });
    }
  }
};
