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

interface GastoSugerido {
  categoria: string;
  valor_sugerido: number;
}
interface DadoJson {
  economia_mensal_estimada: number;
  gastos_sugeridos_para_corte: GastoSugerido[];
  metas: {
    curto_prazo: string;
    medio_prazo: string;
    longo_prazo: string;
  };
  investimentos_sugeridos: string[];
}

export type { DadoBCB, DadoJson, DadoIBGE };
