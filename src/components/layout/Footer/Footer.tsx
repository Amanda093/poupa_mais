const Footer = () => {
  const mostrar = false;

  return (
    <div className="fixed bottom-0 flex w-full flex-col gap-[1em] border-t-[0.15em] border-emerald-500 bg-white py-[0.75em]">
      {mostrar && (
        <div className="container flex gap-[1em]">
          <div className="w-[10%]">
            <h3>Valor Restante:</h3>
            <h3 className="text-emerald-500">VALOR</h3>
          </div>
          <div className="flex w-[90%] flex-col gap-[10%]">
            <div className="flex h-[40%] w-full justify-end rounded-[0.5em] bg-emerald-500 outline-[0.20em] outline-white">
              <div className="w-[20%] bg-amber-500 outline-[0.20em] outline-white"></div>
            </div>
            <div className="flex h-[40%] w-full gap-[0.75em]">
              <div className="flex gap-[0.5em]">
                <div className="aspect-square h-full rounded-[0.25em] bg-emerald-500"></div>
                <div>Valor Restante</div>
              </div>
              <div className="flex gap-[0.5em]">
                <div className="aspect-square h-full rounded-[0.25em] bg-amber-500"></div>
                <div>Conta de luz</div>
              </div>
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
