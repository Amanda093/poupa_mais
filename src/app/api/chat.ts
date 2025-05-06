import { InferenceClient } from "@huggingface/inference";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

import { codigosEstadosIBGE } from "@/context/global";
import { Custeio, DadoBCB, DadoGrafico, DadoIBGE } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const mensagem = req.body as Custeio;
  console.log(mensagem.estado || "sem valor no estado");

  let siglaEstado,
    observacao = "";
  if (mensagem.estado) {
    siglaEstado = codigosEstadosIBGE[mensagem.estado];
  } else {
    return res.status(400).json({ error: "Estado inválido ou não informado" });
  }
  if (mensagem.obs) {
    observacao = "Observações do usuário: " + mensagem.obs;
  }

  async function buscarDadosEconomia(codigoEstado: number) {
    try {
      const codigosEspeciais = new Set([5208707, 5300108]);
      const gerarURLIBGE = (codigo: number) => {
        const nivel = codigosEspeciais.has(codigo) ? "N6" : "N7";
        return `https://servicodados.ibge.gov.br/api/v3/agregados/1705/periodos/-6/variaveis?localidades=${nivel}[${codigo}]`;
      };
      const respostaIBGE = await fetch(gerarURLIBGE(codigoEstado));
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

  const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

  try {
    const economia = await buscarDadosEconomia(mensagem.estado);
    console.log("mensagem recebida:", mensagem);
    console.log("gastos recebidos:", mensagem?.gastos);

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

              O plano deve ser dividido em tópicos e conter formatação em Markdown, como listas e negrito, para facilitar a leitura, use titulos para cada tópico ditos anteriormente.
              Você deve escrever como se estivesse falando diretamente com o usuário.

              ⚠️ Além do plano acima, retorne EXATAMENTE essa estrutura JSON, exatamente abaixo do texto gerado acima, para que eu possa fazer split mais tarde:
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

    const out = await hf.chatCompletion({
      provider: "cerebras",
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "system",
          content: systemprompt,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });
    if (!out.choices || out.choices.length === 0) {
      return res
        .status(500)
        .json({ error: "Resposta inesperada da Huggingface", detalhes: out });
    }

    const mensagemBot = out.choices[0].message.content;
    if (!mensagemBot) {
      return res.status(500).json({ error: "Mensagem da LLM não recebida" });
    } else {
      console.log(mensagemBot);
    }

    const inicioJSON = mensagemBot.indexOf("{");
    const fimJSON = mensagemBot.lastIndexOf("}") + 1;
    const jsonString = mensagemBot.slice(inicioJSON, fimJSON);
    const mensagemString = mensagemBot.slice(0, inicioJSON).trim();

    let dadosParaGraficos: DadoGrafico | null = null;
    try {
      dadosParaGraficos = JSON.parse(jsonString) as DadoGrafico;
      console.log(dadosParaGraficos);
    } catch (e) {
      console.error("Erro ao converter JSON retornado pela LLM:", e);
    }

    res.status(200).json({
      message: mensagemString,
      dadosGraficos: dadosParaGraficos || null,
    });
  } catch (error) {
    console.error("Erro ao processar:", error);
    res
      .status(500)
      .json({ error: "Erro ao processar a mensagem/Sem resposta da LLM" });
  }
};

export default handler;
