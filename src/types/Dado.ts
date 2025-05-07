// aqui, armazenos algumas interfaces que são usadas em pages/api/chat.ts

interface DadoBCB {
  data?: string;
  valor?: string;
}

type DadoIBGE = Array<{
  id: string;
  variavel: string;
  unidade: string;
  resultados: Array<{
    classificacoes: Array<{
      id: string;
      nome: string;
      categoria: Record<string, string>;
    }>;
    series: Array<{
      localidade: {
        id: string;
        nivel: {
          id: string;
          nome: string;
        };
        nome: string;
      };
      serie: Record<string, string>;
    }>;
  }>;
}>;

interface DadoJson {
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

export type { DadoBCB, DadoIBGE, DadoJson };
