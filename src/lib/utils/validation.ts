import { Gasto } from "@/types";

// verifica se a senha sugerida pelo usuário é forte
export const verificarForcaSenha = (senha: string): string => {
  const temMinuscula = /[a-z]/.test(senha);
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[^A-Za-z0-9]/.test(senha);

  const requisitos = [
    temMinuscula,
    temMaiuscula,
    temNumero,
    temEspecial,
  ].filter(Boolean).length;

  if (senha.length < 6) {
    return "Fraca";
  }
  if (requisitos === 2 || requisitos === 3) {
    return "Média";
  }
  if (requisitos === 4) {
    return "Forte";
  }
  return "Fraca";
};

const parseValorMonetario = (valor: string): number => {
  return Number(
    valor
      .replace(/\s/g, "") // remove espaços
      .replace("R$", "") // remove R$
      .replace(/\./g, "") // remove pontos de milhar
      .replace(",", "."), // troca vírgula por ponto
  );
};

//verifica se a renda está correta, se o estado está correto e se as despesas estão corretas; se sim, retorna as validações
export const isFormularioValido = (custeio: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renda: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  estado: any;
  gastos: Gasto[];
}) => {
  const rendaValida =
    !isNaN(parseValorMonetario(custeio.renda)) &&
    parseValorMonetario(custeio.renda) > 0;

  const estadoValido = !isNaN(Number(custeio.estado));

  const temDespesaValida = custeio.gastos.some(
    (gasto: Gasto) =>
      gasto.nome.trim() !== "" &&
      !isNaN(parseValorMonetario(gasto.valor)) &&
      parseValorMonetario(gasto.valor) > 0,
  );

  return rendaValida && estadoValido && temDespesaValida;
};
