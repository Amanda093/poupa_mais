import { InferenceClient } from "@huggingface/inference";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

import { codigosEstadosIBGE } from "@/context/global";
import { db } from "@/lib/services";
import { Custeio, DadoBCB, DadoIBGE, DadoJson, Planejamento } from "@/types";

// este código tem vários res.status() para retornar debugs no terminal serverSide se algo der errado, útil para perceber se o limite de tokens do admin que o estado está inválido foi atingido, por exemplo
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // se o método de requerimento do useChatbot.ts não for post, bloqueia o código de continuae
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // inicializa a mensagem com req.body (utilizado pois o clientside (useChatbot.ts) está se comunicando com um serverside privado (chat.ts)) como um tipo Custeio, axenado com um uid, se houver
  const mensagem = req.body as Custeio & { uid?: string };
  const uid = mensagem.uid;

  //se não houver uid, retorna que o usuário não está autenticado
  if (!uid) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  //inicializa o planejamentoAnterior antes de pegá-lo, garantindo que comece null caso não haja necessidade de requeri-lo (para mais informações, ver na página inicial o checbox do custeio.utilizavel)
  let planejamentoAnterior: Planejamento | null = null;

  /*
    tenta cavar no banco de dados o penúltimo planejamento do usuário.
    é necessário pegar o penúltimo pois a função handler do chat.ts está sendo utilizada simultaneamente com a função de enviar o custeio da página inicial, e o Firestore encara como se o último planejamento fosse o que o usuário está enviando no momento
  */
  try {
    const planejamentosRef = collection(db, "usuarios", uid, "planejamentos");

    //query que pega os dois últimos planejamentos ordenando pelo campo geradoEm decrescente (pega as datas mais recentes)
    const q = query(planejamentosRef, orderBy("geradoEm", "desc"), limit(2));
    const snapshot = await getDocs(q);

    //se realmente houverem mais do que dois planejamentos, ele define doc como sendo o penúltimo planejamento (sendo snapshot um array que contém [planejamento1, planejamento 2] como valores [index 0, index 1])
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
  //se o estado estiver correto, coloca o valor numeral do estado selecionado para a sigla dela (utilizando a variável codigosEstadosIBGE do context/global.ts). Se não, retorna para o admin que o estado está inválido
  let siglaEstado = "";
  if (mensagem.estado) {
    siglaEstado = codigosEstadosIBGE[mensagem.estado];
  } else {
    return res.status(400).json({ error: "Estado inválido ou não informado" });
  }

  //se houver observação, coloca elas no prompt; se não, deixa vazio
  const observacao = mensagem.obs
    ? "Observações do usuário: " + mensagem.obs
    : "";

  //adiciona na prompt este texto, que pega a data que o planejamentoAnterior foi gerado e seu JSON armazenado no firestore, apenas se mensagem.utilizavel for true e houver planejamentoAnterior
  const utilizacao =
    mensagem.utilizavel && planejamentoAnterior
      ? `Além disso, você já deu um planejamento anterior a esse, na data ${planejamentoAnterior.geradoEm} e seu planejamento gerado em JSON foi esse: ${planejamentoAnterior.mensagemJSON}. Baseie-se nesse planejamento para fazer um novo item:
      7. Avaliação baseado em planejamento anterior
       - diga ao usuário se ele está conseguindo caminhar bem em seu planejamento ou não
       - se não, diga o que está faltando em seu planejamento para que seja melhor`
      : "";

  //essa função busca alguns dados da economia brasileira baseado na API SIDRA do IBGE e do BCB, filtrado por estado
  async function buscarDadosEconomia(codigoEstado: number) {
    try {
      const codigosEspeciais = new Set([5208707, 5300108]);
      const nivel = codigosEspeciais.has(codigoEstado) ? "N6" : "N7";
      const url = `https://servicodados.ibge.gov.br/api/v3/agregados/1705/periodos/-6/variaveis?localidades=${nivel}[${codigoEstado}]`;

      const respostaIBGE = await fetch(url);
      const dadosIBGE = (await respostaIBGE.json()) as DadoIBGE;

      //mapeia todos os dados do IBGE retornados e armazena cada um deles numa string separada, que vai ser utilizada no prompt da IA
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
    //busca os dados econômicos baseado no mensagem.estado declarado pelo usuário
    const economia = await buscarDadosEconomia(mensagem.estado);

    //para cada despesa declarada em mensagem.gastos pelo usuário, gastosFormat gera uma string utilizando os valores declarados para utilizar no prompt da IA
    const gastosFormat = mensagem.gastos
      .map(
        (g) =>
          `${g.nome}, que custa R$ ${g.valor}, da categoria ${g.categoria}`,
      )
      .join("\n");

    //essa primeira prompt vai ser mandada como administrador do sistema da IA, para que ela receba um cargo de consultor financeiro e receba os dados econômicos
    const systemprompt = `Você é um consultor financeiro que ajuda brasileiros com educação financeira. Alguns dados do cenário econômico da região estão aqui:
- Taxa Selic: ${economia.taxaSelic}% (dados de ${economia.dataReferencia})
- Dados do IPCA15 do IBGE: ${economia.dadoIBGE}`;

    //essa é a prompt que a IA recebe como prompt do usuário, incluindo ou não os valores declarados anteriormente (observacao, utilizacao)
    const prompt = `
    O usuário tem uma **renda mensal de R$ ${mensagem.renda}** e mora no estado de **${siglaEstado}**, Brasil.
    Gastos mensais informados: ${gastosFormat}
    ${observacao}

    Com base nessas informações, elabore um plano financeiro detalhado para o usuário. O plano deve considerar o contexto econômico brasileiro atual e conter os seguintes tópicos:
    
    ## 🧾 1. Diagnóstico Financeiro
    - Análise percentual dos gastos por categoria
    - Comparação com padrões recomendados (ex: moradia até 30%, transporte até 15%, etc.)
    - Comentários sobre desequilíbrios ou excessos
    
    ## 💰 2. Estimativa de Economia Mensal
    - Valor sugerido para economizar mensalmente
    - Justificativa com base na renda e nos gastos
    
    ## ✂️ 3. Sugestões de Corte de Gastos
    - Liste categorias onde é possível reduzir gastos
    - Para cada item, sugira um valor ideal e explique o motivo
    
    ## 🎯 4. Metas Financeiras
    - **Curto prazo (até 6 meses):** objetivo rápido, como quitar dívidas ou montar reserva de emergência
    - **Médio prazo (6 meses a 2 anos):** exemplo: compra de bens, viagens, cursos
    - **Longo prazo (acima de 2 anos):** como aposentadoria, imóvel próprio, investimentos sólidos
    
    ## 📈 5. Dicas de Investimento
    - Sugestões de investimentos **seguros e acessíveis no Brasil em ${new Date().getFullYear()}**
    - Separar por perfil: conservador, moderado e arrojado
    - Incluir links de referência se possível (como sites do Tesouro Direto, Nubank, etc.)
    
    ## 📝 6. Observações Finais
    - Dicas práticas de organização (planilhas, apps, hábitos)
    - Aviso sobre procurar ajuda de um consultor financeiro para decisões mais complexas
    
        ${utilizacao}
    >
    
    ---
    
    ⚠️ **Além do plano acima, retorne EXATAMENTE esta estrutura JSON abaixo:**
    
    {
  economia_mensal_estimada: number,
  gastos_sugeridos_para_corte: [
    {
      categoria: string,
      valor_sugerido: number,
      percentual_da_renda: number,
      justificativa: string
    },
  ],
  distribuicao_percentual_dos_gastos: [
    {
      categoria: string,
      valor: number,
      percentual_da_renda: number
    },
  ],
  avaliacao_gastos_em_relacao_a_media: [
    {
      categoria: string,
      percentual_da_renda: number,
      limite_recomendado: number,
      comentario: "Acima do recomendado" | "dentro do esperado" | "abaixo do ideal"
    },
  ],
  metas: {
    curto_prazo: {
      descricao: string,
      prazo_estimado_meses: number,
      valor_estimado: number
    },
    medio_prazo: {
      descricao: string,
      prazo_estimado_meses: number,
      valor_estimado: number
    },
    longo_prazo: {
      descricao: string,
      prazo_estimado_anos: number,
      valor_estimado: number
    }
  },
  perfil_de_investidor_sugerido: "conservador" | "moderado" | "arrojado",
  investimentos_sugeridos: [
    {
      nome: string,
      tipo: string,
      indicacao_para: "conservador" | "moderado" | "arrojado",
      link: string
    },
  ],
  ferramentas_de_organizacao_sugeridas: [string],
  observacoes_gerais: [string]
}

⚠️ O JSON deve vir abaixo do plano, em um **bloco separado e bem formatado** para que eu possa fazer parsing automático. Não explique o JSON, apenas mostre-o. Não utilize markdown no JSON.
`;

    //chama a dependência do InferenceClient (API da Hugging Face, uma provedora de IA pública que pode ser acessada na web https://huggingface.co/) com a API KEY do admin
    const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

    //chama a IA llama do meta, mandando para ela o systemprompt com cargo de sistema e depois o prompt com cargo de usuário
    const out = await hf.chatCompletion({
      provider: "cerebras",
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        { role: "system", content: systemprompt },
        { role: "user", content: prompt },
      ],
    });

    //pega a mensagem e armazena a primeira resposta dela (se ela gerar mais que uma) e transforma em dados
    const mensagemBot = out.choices?.[0]?.message?.content;

    if (!mensagemBot) {
      return res.status(500).json({ error: "Mensagem da LLM não recebida" });
    }

    console.log(mensagemBot)

    //esse código abaixo separa a resposta do bot entre a mensagemString (mensagem de texto gerada pela IA) e a mensagem JSON (mensagem em JSON gerada pela IA)
    const inicioJSON = mensagemBot.indexOf("{");
    const fimJSON = mensagemBot.lastIndexOf("}") + 1;
    const jsonString = mensagemBot.slice(inicioJSON, fimJSON);
    const mensagemString = mensagemBot.slice(0, inicioJSON).trim();

    let dadosJson: DadoJson | null = null;
    try {
      dadosJson = JSON.parse(jsonString) as DadoJson;
    } catch (e) {
      console.error("Erro ao converter JSON retornado pela LLM:", e);
    }

    //retorna a mensagemString e os dadosJson para o useChatbot.ts
    return res.status(200).json({
      message: mensagemString,
      dadosJson: dadosJson,
    });
  } catch (error) {
    //se houver qualquer outro erro não especificado, retorna o erro 500
    console.error("Erro geral:", error);
    return res
      .status(500)
      .json({ error: "Erro ao processar a mensagem/Sem resposta da LLM" });
  }
};

export default handler;
