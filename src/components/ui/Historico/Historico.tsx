const Historico = (props: { mes: string; ano: string }) => {
  const { mes, ano } = props;
  return (
    //Div que contem todas as divs
    <div>
      {/* Titulo */}
      <div className="flex items-center gap-[1em]">
        <h2 className="font-bold text-nowrap text-emerald-500">
          {mes} - {ano}
        </h2>
        <div className="color-emerald-500 h-[0.15em] w-[100%] rounded-[0.25em] bg-emerald-500" />
      </div>

      {/* Gráfico */}
      <div className="flex h-[30%] w-full justify-end overflow-hidden rounded-[0.5em] outline-[0.15em] outline-white">
        {/* Barras dos gastos */}
        <div
          className={`flex h-full w-[25%] items-center justify-center bg-emerald-500 text-white outline-[0.15em] outline-white`}
          title="Titulo Despesa"
        >
          R$0,00
        </div>

        <div
          className={`flex h-full w-[25%] items-center justify-center bg-pink-400 text-white outline-[0.15em] outline-white`}
          title="Titulo Despesa"
        >
          R$0,00
        </div>

        <div
          className={`flex h-full w-[25%] items-center justify-center bg-red-500 text-white outline-[0.15em] outline-white`}
          title="Titulo Despesa"
        >
          R$0,00
        </div>

        <div
          className={`flex h-full w-[25%] items-center justify-center bg-indigo-500 text-white outline-[0.15em] outline-white`}
          title="Titulo Despesa"
        >
          R$0,00
        </div>
      </div>

      {/*Legendas*/}
      <div className="mt-2 flex gap-3">
        {/*Uma das legendas*/}
        <div className="flex items-center gap-2">
          {/*Cor*/}
          <div className="h-4 w-4 rounded-xs bg-emerald-500"></div>
          Despesa
        </div>

        {/*Uma das legendas*/}
        <div className="flex items-center gap-2">
          {/*Cor*/}
          <div className="h-4 w-4 rounded-xs bg-pink-400"></div>
          Despesa
        </div>

        {/*Uma das legendas*/}
        <div className="flex items-center gap-2">
          {/*Cor*/}
          <div className="h-4 w-4 rounded-xs bg-indigo-500"></div>
          Despesa
        </div>

        {/*Uma das legendas*/}
        <div className="flex items-center gap-2">
          {/*Cor*/}
          <div className="h-4 w-4 rounded-xs bg-red-500"></div>
          Despesa
        </div>
      </div>
    </div>
  );
};

export { Historico };
