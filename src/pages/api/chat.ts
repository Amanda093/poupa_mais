import type { NextApiRequest, NextApiResponse } from 'next';
import { InferenceClient } from "@huggingface/inference";
import fetch from 'node-fetch';
import { Custeio } from '@/interfaces/Custeio';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const mensagem = req.body as Custeio;

        let regiaoSelect = '';
        if(mensagem.regiao){
            regiaoSelect = mensagem.regiao || 'Nenhum estado selecionado';
        }

        //https://servicodados.ibge.gov.br/api/v3/agregados/{agregado}/periodos/-5/variaveis/{variavel}

        async function buscarDadosEconomia() {

            try {
                const respostIBGE = await fetch('https://servicodados.ibge.gov.br/api/v3/agregados/{agregado}/periodos/-5/variaveis/{variavel}');
                const dadosIBGE: any = await respostaIBGE.json();
                
                const respostaBCB = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json');
                const dadosBCB: any = await respostaBCB.json();
        
                return {
                    taxaSelic: dadosBCB[0]?.valor || 'não disponível',
                    dataReferencia: dadosBCB[0]?.data || 'desconhecida',
                };
            } catch (error) {
                console.error('Erro ao buscar dados econômicos:', error);
                return {
                    taxaSelic: 'erro ao obter',
                    dataReferencia: 'erro ao obter',
                };
            }
        }

        const hf = new InferenceClient( process.env.HUGGINGFACE_API_KEY!);


        try {

            const economia = await buscarDadosEconomia();
            console.log('mensagem recebida:', mensagem);
            console.log('gastos recebidos:', mensagem?.gastos);
            const gastosFormat = mensagem.gastos
                .map((g) => `${g.nome}, que custa R$ ${g.valor}`)
                .join('\n');

            const prompt = `
                O usuário tem uma **renda mensal de R$ ${mensagem.renda}** e mora em São Paulo, Brasil.

                Gastos mensais informados:
                ${gastosFormat}

                Cenário econômico atual:
                - Taxa Selic: ${economia.taxaSelic}% (dados de ${economia.dataReferencia})

                Com base nisso, elabore um plano de economia com:
                - Estimativa de economia mensal
                - Sugestões de corte de gastos
                - Metas de curto, médio e longo prazo
                - Dicas de investimento compatíveis com o cenário brasileiro atual.

                Apenas devolva os dados do usuário e o plano, não inclua na sua resposta os dados do cenário econômico.
            `;

            const out = await hf.chatCompletion({
                provider: "cerebras",
                model: "meta-llama/Llama-3.3-70B-Instruct",
                messages: [
                    { role: "system", content: "Você é um consultor financeiro que ajuda brasileiros com educação financeira." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 800,
                temperature: 0.7,
            });

            if (!out.choices || out.choices.length === 0) {
                return res.status(500).json({ error: 'Resposta inesperada da Huggingface', detalhes: out });
            }

            const mensagemBot = out.choices[0].message.content;

            res.status(200).json({ message: mensagemBot });
        } catch (error) {
            console.error('Erro ao processar:', error);
            res.status(500).json({ error: 'Erro ao processar a mensagem/Sem resposta da LLM' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
};

export default handler;