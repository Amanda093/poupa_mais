//armazenando alguns objetos que serão usados em várias partes do código, reciclando o código

const codigosEstadosIBGE: Record<number, string> = {
  1501: "Belém (PA)",
  2301: "Fortaleza (CE)",
  2601: "Recife (PE)",
  2901: "Salvador (BA)",
  3101: "Belo Horizonte (MG)",
  3301: "Rio de Janeiro (RJ)",
  3501: "São Paulo (SP)",
  4101: "Curitiba (PR)",
  4301: "Porto Alegre (RS)",
  5208707: "Goiânia (GO)", // especial
  5300108: "Brasília (DF)", // especial
};

const categorias = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Compras pessoais",
  "Lazer e entretenimento",
  "Tecnologia e comunicação",
  "Financeiro",
  "Presentes e doações",
  "Pets",
  "Manutenção e emergências",
  "Outros",
];

export { categorias, codigosEstadosIBGE };
