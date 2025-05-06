// lib/firebase/handleCadastro.ts
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { auth, db } from "@/lib/services";
import { Toast } from "@/lib/utils";

interface HandleCadastroProps {
  nome: string;
  email: string;
  password: string;
  confirmpassword: string;
  dataNascimento: Date | undefined;
  router: AppRouterInstance;
}

export const handleCadastro = async ({
  nome,
  email,
  password,
  confirmpassword,
  dataNascimento,
  router,
}: HandleCadastroProps) => {
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

    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nome,
      email,
      dataNascimento,
      usos: 0,
      ultimaGeracao: new Date().toISOString(),
      criadoEm: new Date(),
    });

    router.push("/FAQ"); // redireciona a página de FAQ após cadastrar

    Toast.fire({
      title: "Cadastro realizado com sucesso!",
      icon: "success",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro ao cadastrar:", error);
    Toast.fire({
      title: error.message,
      icon: "error",
    });
  }
};
