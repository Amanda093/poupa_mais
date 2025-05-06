import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { auth, db } from "@/lib/services";
import { Toast } from "@/lib/utils";

//FIXME: warning não está aparecendo

// formato esperado dos dados de entrada
interface HandleCadastroProps {
  nome: string;
  email: string;
  password: string;
  confirmpassword: string;
  dataNascimento: Date | undefined;
  forcaSenha: string;
  router: AppRouterInstance; // usado para redirecionar para outra página
}

export const handleCadastro = async ({
  nome,
  email,
  password,
  confirmpassword,
  dataNascimento,
  forcaSenha,
  router,
}: HandleCadastroProps) => {
  // caso o usuário não tenha digitado seu nome
  if (!nome) {
    Toast.fire({
      icon: "warning",
      title: "Por favor, digite seu nome.",
    });
    return;
  }

  // caso o usuário não tenha digitado seu email
  if (!email) {
    Toast.fire({
      icon: "warning",
      title: "Por favor, digite seu email.",
    });
    return;
  }

  // caso o usuário não tenha colocado sua data de nascimento
  if (dataNascimento == undefined) {
    Toast.fire({
      icon: "warning",
      title: "Por favor, selecione sua data de nascimento.",
    });
    return;
  }

  // calcula a idade do usuário
  const hoje = new Date(); // pega o dia atual
  const idade = hoje.getFullYear() - dataNascimento.getFullYear(); // pega data atual e subtrai a data de nascimento oferecida pelo usúario
  const aniversarioPassou =
    hoje.getMonth() > dataNascimento.getMonth() ||
    (hoje.getMonth() === dataNascimento.getMonth() &&
      hoje.getDate() >= dataNascimento.getDate());

  const idadeFinal = aniversarioPassou ? idade : idade - 1; // caso o aniversário não tenha passado

  // verifica se o usuário tem mais de 16 anos
  if (idadeFinal < 16) {
    Toast.fire({
      icon: "warning",
      title: "Você precisa ter pelo menos 16 anos para se cadastrar.",
    });
    return;
  }

  if (forcaSenha !== "Forte") {
    Toast.fire({
      title: "A senha deve ser forte!",
      icon: "warning",
    });
    return;
  }

  // caso as senhas não estejam iguais
  if (password !== confirmpassword) {
    Toast.fire({
      title: "As senhas não coincidem.",
      icon: "warning",
    });
    return;
  }

  try {
    // cria o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // salva os dados adicionais do usuário no Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nome,
      email,
      dataNascimento: dataNascimento?.toISOString() ?? null,
      usos: 0,
      ultimaGeracao: new Date().toISOString(),
      criadoEm: new Date(),
    });

    router.push("/FAQ"); // redireciona para página de FAQ após cadastrar

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
