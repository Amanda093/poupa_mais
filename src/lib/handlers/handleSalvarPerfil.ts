import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Popup, Toast } from "../utils";
import { db } from "../services";

export const handleSalvar = async (
  user: User | null | undefined,
  novaSenha: string,
  senhaAtual: string,
  nome: string,
  email: string,
  forcaSenha: string,
  dataNascimento: Date | undefined,
) => {
  if (!user) return;

  try {
    if (!nome) {
      Toast.fire({
        icon: "warning",
        title: "Por favor, digite seu nome.",
      });
      return;
    }

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

    // Reautenticação antes de mudanças sensíveis
    if (novaSenha && !senhaAtual) {
      Popup.fire({
        html: `<div><p>Você precisa fornecer a senha atual para alterar senha.</p></div> `,
        icon: "warning",
      });
      return;
    }

    const credential = EmailAuthProvider.credential(user.email!, senhaAtual);
    await reauthenticateWithCredential(user, credential);

    if (novaSenha) {
      await updatePassword(user, novaSenha);
    }

    // Atualiza nome e foto
    await updateProfile(user, {
      displayName: nome,
      photoURL: user.photoURL || undefined,
    });

    // Atualiza Firestore
    const userRef = doc(db, "usuarios", user.uid);
    await updateDoc(userRef, {
      nome,
      email,
      dataNascimento,
    });

    Toast.fire({
      title: "Dados atualizados com sucesso!",
      icon: "success",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao salvar dados:", error);
      Popup.fire({
        html: `<div><p>Erro ao salvar:</p><b>${error.message}<b/></div> `,
        icon: "error",
      });
    } else {
      console.error("Erro desconhecido:", error);
      Popup.fire({
        html: `<div><p>Erro desconhecido ao salvar dados.</p></div> `,
        icon: "error",
      });
    }
  }
};
