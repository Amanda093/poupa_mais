const Historico = () =>{
  return(
    //Div que contem todas as divs
    <div> 
      {/* Titulo */}
      <div>
      <h2 className="text-emerald-500 font-bold">Fevereiro</h2>
      <hr className="bg-emerald-500 w-10" />
      </div>
      
        {/* Gráfico */}
        <div className="flex h-[30%] w-full justify-end overflow-hidden rounded-[0.5em] bg-emerald-500 outline-[0.15em] outline-white">
              {/* Barras dos gastos */}
                  <div
                    className={`h-full outline-[0.15em] outline-white w-[10%]`}
                    title= "Blue Lock"
                  ><p className="text-white">oiajsdo</p></div>

                  <div
                    className={`h-full outline-[0.15em] outline-white w-[10%]`}
                    title= "Blue Lock"
                  ><p>osadom</p></div>

                  <div
                    className={`h-full outline-[0.15em] outline-white w-[10%]`}
                    title= "Blue Lock"
                  ><p>osadom</p></div>

                  <div
                    className={`h-full outline-[0.15em] outline-white w-[70%]`}
                    title= "Blue Lock"
                  ><p>osadom</p></div>
        </div>
    </div>
  );
};

export { Historico };