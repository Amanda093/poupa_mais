import Image from "next/image";
import { FaOctopusDeploy } from "react-icons/fa";

import { Button, Input } from "@/components";

import Perfil from "../../../public/FotoPerfilPlaceHolder.png";
import iconFoto from "../../../public/MudarFoto.png";
import password from "../../../public/password.png";

import { Button, Input, Title, Historico } from "@/components";

const HistoricoPage = () => {
  return (
    //Div com que contem a todos os elementos
    <div className="h-auto flex flex-col w-full items-center">
      {/*Div de Perfil*/}
      <div className="flex gap-10 w-fit">

        {/*Div da foto de perfil*/}
        <div className="flex flex-col w-max items-center gap-5">
        {/*Foto do perfil*/}
        <Image
        src={Perfil}
        width={158}
        height={158}
        alt="Profile Picture"
        className="rounded-full border-3 border-emerald-500"
        /> 

        {/*Botão de alterar foto de perfil*/}
        <Button>
          <Image 
          src={iconFoto}
          width={25}
          height={25}
          alt="Profile Picture"
          />
          Mudar Foto
        </Button>
        </div>

        
        {/*Div com a primeira coluna de inputs*/}
        <div className="flex flex-col justify-between mb-2 w-fit">
          
          <div>
          <label htmlFor="nome" className="">
            Nome
          </label>
          <Input
            id="nome"
            type="text"
            placeholder="Komi San"
            variant="default"
            className="w-75"
          />
          </div>

          <div>
          <label htmlFor="email" className="">
            Email
          </label>
          <Input
            id="email"
            type="text"
            placeholder="Komi San"
            variant="default"
            className="w-75"
          />
          </div>

          <div>
          <label htmlFor="data" className="">
            Data
          </label>
          <Input
            id="data"
            placeholder="Komi San"
            variant="default"
            type="date"
            className="w-75"
          /> 
          </div>

        </div>


        {/*Div com a segunda coluna de inputs*/}
        <div className="flex flex-col justify-between mb-2">
          
          <div>
          <label htmlFor="novaSenha" className="">
            Nova Senha
          </label>
          <Input
                  id="password"
                  type="password"
                  placeholder="Nova Senha"
                  variant="default"
                  className="w-75"

                  icon={
                    <Image
                      src={password}
                      alt="Ícone Senha"
                      width={20}
                      height={20}
                    />
                  }
                />
          </div>

          <div>
          <label htmlFor="senhaAtual" className="">
            Senha Atual
          </label>
          <Input
                  id="password"
                  type="password"
                  placeholder="Nova Senha"
                  variant="default"
                  className="w-75"

                  icon={
                        <Image
                          src={password}
                          alt="Ícone Senha"
                          width={20}
                          height={20}
                        />
                      }
            />
          </div>

          <div className="h-[61px] flex items-end">
          {/*Botão de alterar senha*/}
          <Button className="w-5/6 h-min">
            <Image 
            src={iconFoto}
            width={25}
            height={25}
            alt="Profile Picture"
            className="rounded-full border-3 border-emerald-500"
          />

          {/*Botão de alterar perfil*/}
          <Button className="w-4/5">
            <Image
              src={iconFoto}
              width={25}
              height={25}
              alt="Profile Picture"
            />
            Salvar alterações
          </Button>
        </div>

        {/*Div com a primeira coluna de inputs*/}
        <div className="mb-2 flex flex-col justify-between">
          <div>
            <label htmlFor="nome" className="">
              Nome
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="Komi San"
              className=""
              variant="default"
            />
          </div>

          <div>
            <label htmlFor="email" className="">
              Email
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Komi San"
              variant="default"
            />
          </div>

      {/*Div do historico*/}
      <div>
      <Title
          mainTitle="Histórico de"
          subTitle="Planejamentos"
        />
      <Historico />
      </div>

    </div>
  );
};

export default HistoricoPage;
