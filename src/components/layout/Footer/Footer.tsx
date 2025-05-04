type Gasto = {
  nome: string;
  valor: string;
  categoria: string;
};

interface FooterProps {
  renda: string;
  gastos: Gasto[];
}

const getCategoriaCor = (categoria: string): string => {
  switch (categoria.toLowerCase()) {
    case "moradia":
      return "bg-blue-500";
    case "alimentação":
      return "bg-green-500";
    case "transporte":
      return "bg-orange-500";
    case "saúde":
      return "bg-red-500";
    case "educação":
      return "bg-purple-500";
    case "compras pessoais":
      return "bg-pink-400";
    case "lazer e entretenimento":
      return "bg-yellow-500";
    case "tecnologia e comunicação":
      return "bg-indigo-500";
    case "financeiro":
      return "bg-teal-500";
    case "presentes e doações":
      return "bg-rose-500";
    case "pets":
      return "bg-amber-500";
    case "manutenção e emergências":
      return "bg-cyan-500";
    case "outros":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const Footer: React.FC<FooterProps> = ({ renda, gastos }) => {
  const rendaNumerica = parseFloat(renda.replace(/\D/g, "")) / 100;
  const gastosTotais = gastos.reduce((total, gasto) => {
    const valor = parseFloat(gasto.valor.replace(/\D/g, "")) / 100;
    return total + (isNaN(valor) ? 0 : valor);
  }, 0);
  const restante = rendaNumerica - gastosTotais;

  const mostrar = rendaNumerica > 0;

  return (
    <div className="fixed bottom-0 flex w-full flex-col border-t-[0.15em] border-emerald-500 bg-white py-[0.75em]">
      {mostrar && (
        <div className="container flex h-[4.25em] gap-[1em]">
          <div className="max-lg: w-[10%] max-2xl:w-[15%] max-lg:hidden">
            <h3 className="text-nowrap">Valor Restante:</h3>
            <h3 className="text-emerald-500">
              {restante.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h3>
          </div>
          <div className="flex w-[90%] flex-col gap-[10%] max-2xl:w-[85%] max-lg:w-full">
            {/* Gráfico */}
            <div className="flex h-[30%] w-full justify-end overflow-hidden rounded-[0.5em] bg-emerald-500 outline-[0.15em] outline-white">
              {/* Barras dos gastos */}
              {gastos.map((gasto, index) => {
                const valor = parseFloat(gasto.valor.replace(/\D/g, "")) / 100;
                const largura = (valor / rendaNumerica) * 100;

                return (
                  <div
                    key={index}
                    className={`h-full ${getCategoriaCor(gasto.categoria)} outline-[0.15em] outline-white`}
                    style={{
                      width: `${largura}%`,
                    }}
                    title={gasto.nome}
                  ></div>
                );
              })}
            </div>

            {/* Legendas */}
            <div className="flex h-[50%] w-full max-w-full gap-[0.75em] overflow-x-auto overflow-y-hidden">
              {gastos.map((gasto, index) => (
                <div key={index} className="flex items-center gap-[0.5em]">
                  <div
                    className={`aspect-square h-[1em] rounded-[0.25em] ${getCategoriaCor(
                      gasto.categoria,
                    )}`}
                  ></div>
                  <div className="text-nowrap">{gasto.nome || "Despesa"}</div>
                </div>
              ))}
              {restante > 0 && (
                <div className="flex items-center gap-[0.5em]">
                  <div className="aspect-square h-[1em] rounded-[0.25em] bg-emerald-500"></div>
                  <div className="text-nowrap">Valor Restante</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-light container text-center">
        As sugestões geradas por IA são apenas estimativas e não substituem a
        orientação de um especialista. Sempre analise com cuidado antes de tomar
        decisões financeiras.
      </div>
    </div>
  );
};

export { Footer };
