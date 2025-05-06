import { InferenceClient } from "@huggingface/inference";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

import { codigosEstadosIBGE } from "@/context/global";
import { db } from "@/lib/services";
import { Custeio, DadoBCB, DadoGrafico, DadoIBGE, Planejamento } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const mensagem = req.body as Custeio & { uid?: string };
  const uid = mensagem.uid;

  if (!uid) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  let planejamentoAnterior: Planejamento | null = null;

  try {
    const planejamentosRef = collection(db, "usuarios", uid, "planejamentos");

    const q = query(planejamentosRef, orderBy("geradoEm", "desc"), limit(2));
    const snapshot = await getDocs(q);

    if (snapshot.docs.length >= 2) {
      const doc = snapshot.docs[1]; // Penúltimo planejamento
      const raw = doc.data();

      planejamentoAnterior = {
        id: doc.id,
        custeio: {
          estado: raw.custeio.estado,
          gastos: raw.custeio.gastos,
          obs: raw.custeio.obs,
          renda: raw.custeio.renda,
          utilizavel: raw.custeio.utilizavel,
        },
        geradoEm: raw.geradoEm,
        mensagemBot: raw.mensagemBot,
        mensagemJSON: raw.mensagemJSON,
      };
    }
  } catch (err) {
    console.error("Erro ao buscar planejamentos anteriores:", err);
  }

  // Validação do estado
  let siglaEstado = "";
  if (mensagem.estado) {
    siglaEstado = codigosEstadosIBGE[mensagem.estado];
  } else {
    return res.status(400).json({ error: "Estado inválido ou não informado" });
  }

  const observacao = mensagem.obs
    ? "Observações do usuário: " + mensagem.obs
    : "";

  const utilizacao =
    mensagem.utilizavel && planejamentoAnterior
      ? `Saiba que você já deu um planejamento anterior a esse, na data ${planejamentoAnterior.geradoEm} e seu planejamento gerado em JSON foi esse: ${planejamentoAnterior.mensagemJSON}. Baseie-se nesse planejamento anterior para fazer o seu novo planejamento, além de dizer ao usuário se ele está caminhando no caminho certo ou errado.`
      : "";

  async function buscarDadosEconomia(codigoEstado: number) {
    try {
      const codigosEspeciais = new Set([5208707, 5300108]);
      const nivel = codigosEspeciais.has(codigoEstado) ? "N6" : "N7";
      const url = `https://servicodados.ibge.gov.br/api/v3/agregados/1705/periodos/-6/variaveis?localidades=${nivel}[${codigoEstado}]`;

      const respostaIBGE = await fetch(url);
      const dadosIBGE = (await respostaIBGE.json()) as DadoIBGE;

      const formatadoIBGE = dadosIBGE
        .map((item) => {
          const nome = item.variavel;
          const unidade = item.unidade;
          const serie = item.resultados?.[0]?.series?.[0]?.serie;

          const entradas = Object.entries(serie ?? {})
            .map(([data, valor]) => `${data}: ${valor}`)
            .join(", ");

          return `${nome} (${unidade}): ${entradas}`;
        })
        .join("\n\n");

      const respostaBCB = await fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json",
      );
      const dadosBCB = (await respostaBCB.json()) as DadoBCB[];

      return {
        taxaSelic: dadosBCB[0]?.valor || "desconhecida",
        dataReferencia: dadosBCB[0]?.data || "desconhecida",
        dadoIBGE: formatadoIBGE || "desconhecido",
      };
    } catch (error) {
      console.error("Erro ao buscar dados econômicos:", error);
      return {
        taxaSelic: "erro ao obter",
        dataReferencia: "erro ao obter",
        dadoIBGE: "erro ao obter",
      };
    }
  }

  try {
    const economia = await buscarDadosEconomia(mensagem.estado);

    const gastosFormat = mensagem.gastos
      .map(
        (g) =>
          `${g.nome}, que custa R$ ${g.valor}, da categoria ${g.categoria}`,
      )
      .join("\n");

    const systemprompt = `Você é um consultor financeiro que ajuda brasileiros com educação financeira. Alguns dados do cenário econômico da região estão aqui:
- Taxa Selic: ${economia.taxaSelic}% (dados de ${economia.dataReferencia})
- Dados do IPCA15 do IBGE: ${economia.dadoIBGE}`;

    const prompt = `
O usuário tem uma **renda mensal de R$ ${mensagem.renda}** e mora no estado de **${siglaEstado}**, Brasil.

Gastos mensais informados:
${gastosFormat}

${observacao}

Com base nisso, elabore um plano de economia para o usuário, incluindo:
- Estimativa de economia mensal
- Sugestões de corte de gastos
- Metas de curto, médio e longo prazo
- Dicas de investimento compatíveis com o cenário brasileiro atual

O plano deve ser dividido em tópicos e conter formatação em Markdown, como listas e negrito, para facilitar a leitura.

${utilizacao}

⚠️ Além do plano acima, retorne EXATAMENTE essa estrutura JSON, exatamente abaixo do texto gerado acima:
{
  "economia_mensal_estimada": número,
  "gastos_sugeridos_para_corte": [{ "categoria": string, "valor_sugerido": número }],
  "metas": {
    "curto_prazo": string,
    "medio_prazo": string,
    "longo_prazo": string
  },
  "investimentos_sugeridos": [string]
}

⚠️ O JSON deve vir abaixo do plano, em um **bloco separado e bem formatado** para que eu possa fazer parsing automático. Não explique o JSON, apenas mostre-o. Não utilize markdown.
`;

    const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

    const out = await hf.chatCompletion({
      provider: "cerebras",
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        { role: "system", content: systemprompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const mensagemBot = out.choices?.[0]?.message?.content;

    if (!mensagemBot) {
      return res.status(500).json({ error: "Mensagem da LLM não recebida" });
    }

    const inicioJSON = mensagemBot.indexOf("{");
    const fimJSON = mensagemBot.lastIndexOf("}") + 1;
    const jsonString = mensagemBot.slice(inicioJSON, fimJSON);
    const mensagemString = mensagemBot.slice(0, inicioJSON).trim();

    let dadosParaGraficos: DadoGrafico | null = null;
    try {
      dadosParaGraficos = JSON.parse(jsonString) as DadoGrafico;
    } catch (e) {
      console.error("Erro ao converter JSON retornado pela LLM:", e);
    }

    return res.status(200).json({
      message: mensagemString,
      dadosGraficos: dadosParaGraficos,
    });
  } catch (error) {
    console.error("Erro geral:", error);
    return res
      .status(500)
      .json({ error: "Erro ao processar a mensagem/Sem resposta da LLM" });
  }
};

export default handler;
