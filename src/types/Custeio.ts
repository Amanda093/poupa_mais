import { Interface } from "node:readline";
import { Timestamp } from "firebase/firestore";

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
};

export type { Custeio, Gasto, Planejamento };
