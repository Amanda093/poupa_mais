import axios from "axios";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/services";
import { Custeio, DadoGrafico } from "@/types";

const useChatbot = () => {
  const [mensagemBot, setMensagemBot] = useState<string>("");
  const [respostaJson, setRespostaJson] = useState<DadoGrafico | null>(null);
  const [user, loading] = useAuthState(auth);

  const sendMensagem = async (
    mensagem: Custeio,
  ): Promise<{ texto: string; json: DadoGrafico | null } | undefined> => {
    if (loading) {
      console.warn("Esperando carregar o usuário...");
      return;
    }

    if (!user) {
      console.error("Usuário não autenticado. A mensagem não será enviada.");
      return { texto: "Erro: usuário não autenticado.", json: null };
    }

    try {
      const resposta = await axios.post("/api/chat", {
        ...mensagem,
        uid: user.uid, // Adicionando o uid no corpo
      });

      const mensagemTexto =
        resposta.data.message ?? "Erro: resposta vazia do bot.";
      const dados = resposta.data.dadosGraficos ?? null;

      setMensagemBot(mensagemTexto);
      setRespostaJson(dados);

      if (!dados) {
        console.error("Resposta JSON nula, não será salva no Firestore.");
      }

      return { texto: mensagemTexto, json: dados };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao enviar a mensagem para a API:",
          error.response?.data || "Sem resposta do servidor",
        );
      }
      return { texto: "Erro ao comunicar com o bot.", json: null };
    }
  };

  return { mensagemBot, respostaJson, sendMensagem };
};

export { useChatbot };
