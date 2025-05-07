import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/services/clientApp";
import { isFormularioValido } from "@/lib/utils";
import { Popup } from "@/lib/utils/sweetalert";
import { Custeio } from "@/types";

//interface para lidar com o form da IA
interface HandleFormIAParams {
  custeio: Custeio;
  user: User | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  //se o formulário não for válido, retorna um popup de campos incompletossss
  if (!isFormularioValido(custeio)) {
    Popup.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Preencha todos os campos obrigatórios antes de continuar.",
    });
    return;
  }

  //popup que pede para o usuário confirmar o envio
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

  //essa função manda a mensagem de custeio para a IA e aguarda a resposta
  try {
    const respostaIA = await sendMensagem(custeio);

    if (!user) {
      localStorage.setItem("usouGeracao", "true");
      return;
    }

    if (!respostaIA || !respostaIA.json) {
      console.error("Resposta JSON nula. Não será salva no Firestore.");
      return;
    }

    //aqui, o código pega no firesotre os dados do usuário
    const userDocRef = doc(db, "usuarios", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const usosAtual = userDoc.data().usos ?? 0;

      //quando esse script for utilizado, aumenta os usos em 1
      await updateDoc(userDocRef, {
        usos: usosAtual + 1,
      });

      //aqui, o código chama a coleção de planejamentos do usuário e adiciona mais um planejamento baseado nos inputs
      const planejamentosRef = collection(userDocRef, "planejamentos");

      await addDoc(planejamentosRef, {
        usarAnteriores: custeio.utilizavel,
        mensagemJSON: respostaIA.json,
        mensagemBot: respostaIA.texto ?? "Resposta não gerada",
        custeio,
        geradoEm: serverTimestamp(),
      });
    } else {
      console.error("Usuário não encontrado no Firestore.");
    }
  } catch (error) {
    console.error("Erro ao gerar planejamento:", error);
  } finally {
    //termina o script e faz o site scrollar até a <div id="planejamentoRef"> na página
    setGerando(false);
    setTimeout(() => {
      planejamentoRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}
