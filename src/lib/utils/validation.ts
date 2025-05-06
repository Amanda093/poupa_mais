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
