"use client";

import useChatbot from '@/hooks/useChatbot';
import { Custeio } from '@/interfaces/Custeio';
import React, { useState } from 'react';
import { LuBot, LuPlus, LuSendHorizontal } from 'react-icons/lu';
import Markdown from 'react-markdown';

interface IChatComponentProps {
}

const ChatComponent: React.FunctionComponent<IChatComponentProps> = () => {

    const [custeio, setCusteio] = useState<Custeio>({
        renda: '',
        gastos: [{ nome: '', valor: '' }]
      });
    
      const handleChangeRenda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCusteio({ ...custeio, renda: e.target.value });
      };
    
      const handleChangeGastos = (index: number, campo: 'nome' | 'valor', value: string) => {
        const novosGastoss = [...custeio.gastos];
        novosGastoss[index][campo] = value;
        setCusteio({ ...custeio, gastos: novosGastoss });
      };
    
      const addGastos = () => {
        setCusteio({
          ...custeio,
          gastos: [...custeio.gastos, { nome: '', valor: '' }],
        });
      };

    const { mensagemBot, sendMensagem } = useChatbot();

    const handleSend = () => {

        const envio: Custeio = custeio;
          
          sendMensagem(envio);
        };

  return (
    <div className='flex flex-col h-[80vh] bg-white'>
        <h2 className='p-4 font-semibold text-lg text-center bg-blue-100 flex text-bluel800 justify-center items-center gap-2'>
            React + OpenAI Chatbot <LuBot size={25}/>
        </h2>
        <div className='flex flex-col items-center p-4 bg-gray-50'>
            <input type='text' 
                className='flex-1 p-2 border rounded-lg focus:outline-none'
                placeholder='Sua renda fixa'
                value={custeio.renda}
                onChange={(e) => handleChangeRenda(e)}
            />
            {custeio.gastos.map((gasto, index) => (
                <div key={index} className='flex flex-row overflow-y-auto'>
                <input type='text'
                    className='flex-1 p-2 border rounded-lg focus:outline-none'
                    placeholder={ `Gasto ${index + 1}`}
                    value={gasto.nome}
                    onChange={(e) => { handleChangeGastos(index, 'nome', e.target.value)}}         
                 />
                 <input type='text'
                    className='flex-1 p-2 border rounded-lg focus:outline-none'
                    placeholder={ `Valor ${index + 1}`}
                    value={gasto.valor}
                    onChange={(e) => { handleChangeGastos(index, 'valor', e.target.value)}}                
                 />
                </div>
            ))}
            <div className='flex flex-row'>
            <button onClick={addGastos} className='p-2'> <LuPlus size={20}/></button>
            <button onClick={handleSend} className='p-2'>
                <LuSendHorizontal size={20} />
            </button>
            </div>
        </div>
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
                <div className={`p-3 rounded-lg max-w-xs`}>
                    <Markdown>{mensagemBot}</Markdown>
                </div>
        </div>
        
    </div>
  );
}

export default ChatComponent;