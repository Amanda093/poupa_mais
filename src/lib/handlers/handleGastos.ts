import { Custeio } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";

//todas as funções com handleChange utiizam o input para atualizar o custeio com as novas informações
export const handleChangeRenda = (renda: string, setCusteio: Function) => {
  setCusteio((prev: Custeio) => ({ ...prev, renda: renda }));
};

export const handleChangeObs = (observacao: string, setCusteio: Function) => {
  setCusteio((prev: Custeio) => ({ ...prev, obs: observacao }));
};

export const handleChangeEstado = (
  estado: string,
  setEstadoSelecionado: Function,
  setCusteio: Function,
) => {
  setEstadoSelecionado(estado);
  setCusteio((prev: Custeio) => ({ ...prev, estado: Number(estado) }));
};

export const handleChangeUtilizavel = (
  valor: CheckedState,
  setCusteio: Function,
) => {
  setCusteio((prev: Custeio) => ({ ...prev, utilizavel: !!valor }));
};

export const handleChangeGastos = (
  index: number,
  campo: "nome" | "valor" | "categoria",
  value: string,
  setCusteio: Function,
) => {
  setCusteio((prev: Custeio) => {
    const novosGastos = [...prev.gastos];
    novosGastos[index][campo] = value;
    return { ...prev, gastos: novosGastos };
  });
};

//as funções addGasto e removeGasto adicionam ou retiram um gasto do custeios
export const addGasto = (setCusteio: Function) => {
  setCusteio((prev: Custeio) => ({
    ...prev,
    gastos: [...prev.gastos, { nome: "", valor: "", categoria: "" }],
  }));
};

export const removeGasto = (index: number, setCusteio: Function) => {
  setCusteio((prev: Custeio) => ({
    ...prev,
    gastos: prev.gastos.filter((_, i) => i !== index),
  }));
};
