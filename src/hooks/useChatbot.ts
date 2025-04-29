import axios from "axios";
import { useState } from "react";

import { Custeio } from "@/interface";

const useChatbot = () => {
  const [mensagemBot, setMensagemBot] = useState<string>("");

  const sendMensagem = async (mensagem: Custeio) => {
    try {
      // Envia a mensagem para a API
      const resposta = await axios.post("/api/chat", mensagem);

      const mensagemBot =
        resposta.data.message ?? "Erro: resposta vazia do bot.";

      setMensagemBot(mensagemBot);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao enviar a mensagem para a API:",
          error.response?.data || "Sem resposta do servidor",
        );
      }
    }
  };

  return { mensagemBot, sendMensagem };
};

export { useChatbot };
