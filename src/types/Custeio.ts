import { Timestamp } from "firebase/firestore";

//aqui, criamos e exportamos a interface Planejamento e Custeio que são utilizadas no código

interface Gasto {
  nome: string;
  valor: string;
  categoria: string;
}

interface Custeio {
  renda: string;
  gastos: Gasto[];
  estado: number;
  obs: string;
  utilizavel: boolean;
}

interface Planejamento {
  id: string; // assumindo que o id do Firebase é uma string
  custeio: Custeio;
  geradoEm: Timestamp;
  mensagemBot: string; // mensagem do bot em markdown
  mensagemJSON: []; // mensagem em JSON
}

export type { Custeio, Gasto, Planejamento };
