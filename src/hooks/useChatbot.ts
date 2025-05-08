import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/services";
import { Custeio, DadoJson } from "@/types";

const useChatbot = () => {
  //primeiro, declaramos as váriaveis que serão utilizadas no código
  const [mensagemBot, setMensagemBot] = useState<string>("");
  const [respostaJson, setRespostaJson] = useState<DadoJson | null>(null);
  const [user, loading] = useAuthState(auth);

  //função sendMensagem irá mandar a mensagem de tipo Custeio, avaliando se o usuário está logado para caso for necessário pegar dados do Firestore.
  const sendMensagem = async (
    mensagem: Custeio,
  ): Promise<{ texto: string; json: DadoJson | null } | undefined> => {
    if (loading) {
      console.warn("Esperando carregar o usuário...");
      return;
    }

    //aqui, a variável resposta dá um post em pages/api/chat, enviando a mensagem e o uid do usuário se houver.
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resposta: AxiosResponse<any, any>;
      if (user) {
        resposta = await axios.post("/api/chat", {
          ...mensagem,
          uid: user.uid, // Adicionando o uid no corpo
        });
      } else {
        resposta = await axios.post("/api/chat", {
          ...mensagem,
        });
      }

      //formata a resposta da em  IA em texto para um string (mensagemTexto) e a resposta em JSON para um tipo dadosJson (dados), para depois armazenar as duas respostas
      const mensagemTexto =
        resposta.data.message ?? "Erro: resposta vazia do bot.";
      const dados = resposta.data.dadosJson ?? null;

      setMensagemBot(mensagemTexto);
      setRespostaJson(dados);

      if (!dados) {
        console.error("Resposta JSON nula, não será salva no Firestore.");
      }

      //se o try der certo, retorna mensagemTexto e dados(JSON)
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

  //ao verificar que tudo deu certo, useChatBot retorna mensagemBot, respostaJson e a função sendMensagem
  return { mensagemBot, respostaJson, sendMensagem };
};

export { useChatbot };
