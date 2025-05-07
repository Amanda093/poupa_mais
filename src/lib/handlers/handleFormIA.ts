// lib/utils/handleSend.ts
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Popup } from "@/lib/utils/sweetalert";
import { isFormularioValido } from "@/lib/utils";
import { Custeio } from "@/types";
import { User } from "firebase/auth";
import { db } from "@/lib/services/clientApp";

interface HandleFormIAParams {
  custeio: Custeio;
  user: User | null | undefined;
  sendMensagem: (envio: Custeio) => Promise<any>;
  setGerando: (value: boolean) => void;
  planejamentoRef: React.RefObject<HTMLDivElement | null>;
}

export async function handleFormIA({
  custeio,
  user,
  sendMensagem,
  setGerando,
  planejamentoRef,
}: HandleFormIAParams) {
  if (!isFormularioValido(custeio)) {
    Popup.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Preencha todos os campos obrigatórios antes de continuar.",
    });
    return;
  }

  const confirm = await Popup.fire({
    html: `<div><h3>Confirmar envio?</h3></div>`,
    icon: "question",
    focusConfirm: false,
    showDenyButton: true,
    confirmButtonText: "Sim",
    confirmButtonColor: "#00BC7D",
    denyButtonText: "Não",
  });

  if (!confirm.isConfirmed) return;

  setGerando(true);

  try {
    const respostaIA = await sendMensagem(custeio);
    console.log("Resposta IA:", respostaIA);

    if (!user) {
      localStorage.setItem("usouGeracao", "true");
      return;
    }

    if (!respostaIA || !respostaIA.json) {
      console.error("Resposta JSON nula. Não será salva no Firestore.");
      return;
    }

    const userDocRef = doc(db, "usuarios", user.uid); // db deve estar disponível globalmente ou importado aqui
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const usosAtual = userDoc.data().usos ?? 0;

      await updateDoc(userDocRef, {
        usos: usosAtual + 1,
      });

      const planejamentosRef = collection(userDocRef, "planejamentos");

      await addDoc(planejamentosRef, {
        usarAnteriores: custeio.utilizavel,
        mensagemJSON: respostaIA.json,
        mensagemBot: respostaIA.texto ?? "Resposta não gerada",
        custeio,
        geradoEm: serverTimestamp(),
      });

      console.log("Dados enviados para o Firestore com sucesso!");
    } else {
      console.error("Usuário não encontrado no Firestore.");
    }
  } catch (error) {
    console.error("Erro ao gerar planejamento:", error);
  } finally {
    setGerando(false);
    setTimeout(() => {
      planejamentoRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}
