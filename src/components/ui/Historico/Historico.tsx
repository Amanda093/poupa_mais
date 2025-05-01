const Historico = ({mes}) =>{
  return(
    //Div que contem todas as divs
    <div> 
      {/* Titulo */}
      <div className="flex gap-2 items-center">
      <h2 className="text-emerald-500 font-bold">{mes}</h2>
      <hr className="bg-emerald-500 w-[100%] h-0.5 color-emerald-500 border-none" />
      </div>

        {/* Gráfico */}
        <div className="flex h-[30%] w-full justify-end overflow-hidden rounded-[0.5em] outline-[0.15em] outline-white">
              {/* Barras dos gastos */}
                  <div
                    className={`h-full outline-[0.15em] outline-white w-[25%] flex justify-center items-center text-white bg-emerald-500`}
                    title= "Blue Lock"
                  >R$250,00</div>

                  <div
                    className={`h-full outline-[0.15em] outline-white w-[25%] flex justify-center items-center text-white bg-pink-400`}
                    title= "Blue Lock"
                  >R$250,00</div>

                  <div
                    className={`h-full outline-[0.15em] outline-white w-[25%] flex justify-center items-center text-white bg-red-500`}
                    title= "Blue Lock"
                  >R$250,00</div>

                  <div
                    className={`h-full outline-[0.15em] outline-white w-[25%] flex justify-center items-center text-white bg-indigo-500`}
                    title= "Blue Lock"
                  >R$250,00</div>
        </div>

        {/*Legendas*/}
        <div className="flex mt-2 gap-3">

          {/*Uma das legendas*/}
          <div className="flex gap-2 items-center">
              {/*Cor*/}
              <div className="w-4 h-4 bg-emerald-500 rounded-xs"></div>
              Mercado
          </div>

          {/*Uma das legendas*/}
          <div className="flex gap-2 items-center">
              {/*Cor*/}
              <div className="w-4 h-4 bg-pink-400 rounded-xs"></div>
              Impostos
          </div>

          {/*Uma das legendas*/}
          <div className="flex gap-2 items-center">
              {/*Cor*/}
              <div className="w-4 h-4 bg-indigo-500 rounded-xs"></div>
              Água
          </div>

          {/*Uma das legendas*/}
          <div className="flex gap-2 items-center">
              {/*Cor*/}
              <div className="w-4 h-4 bg-red-500 rounded-xs"></div>
              Luz
          </div>
        
        </div>

          
    </div>
  );
};

export { Historico };