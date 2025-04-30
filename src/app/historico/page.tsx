import Image from "next/image";
import { FaOctopusDeploy } from "react-icons/fa";

import { Button, Input, Title, Historico } from "@/components";

import Perfil from "../../../public/FotoPerfilPlaceHolder.png";
import iconFoto from "../../../public/MudarFoto.png";
import password from "../../../public/password.png";

const HistoricoPage = () => {
  return (
    // Div que contém todos os elementos
    <div className="h-auto flex flex-col w-full items-center">
      {/* Div de Perfil */}
      <div className="flex gap-10 w-fit">

        {/* Div da foto de perfil */}
        <div className="flex flex-col w-max items-center gap-5">
          {/* Foto do perfil */}
          <Image
            src={Perfil}
            width={158}
            height={158}
            alt="Profile Picture"
            className="rounded-full border-3 border-emerald-500"
          /> 

          {/* Botão de alterar foto de perfil */}
          <Button>
            <Image 
              src={iconFoto}
              width={25}
              height={25}
              alt="Alterar Foto"
            />
            Mudar Foto
          </Button>
        </div>

        {/* Div com a primeira coluna de inputs */}
        <div className="flex flex-col justify-between mb-2 w-fit">
          <div>
            <label htmlFor="nome">Nome</label>
            <Input
              id="nome"
              type="text"
              placeholder="Komi San"
              variant="default"
              className="w-75"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="text"
              placeholder="komisan@email.com"
              variant="default"
              className="w-75"
            />
          </div>
          <div>
            <label htmlFor="data">Data</label>
            <Input
              id="data"
              type="date"
              variant="default"
              className="w-75"
            /> 
          </div>
        </div>

        {/* Div com a segunda coluna de inputs */}
        <div className="flex flex-col justify-between mb-2 w-fit">
          <div>
            <label htmlFor="novaSenha">Nova Senha</label>
            <Input
              id="novaSenha"
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
            <label htmlFor="senhaAtual">Senha Atual</label>
            <Input
              id="senhaAtual"
              type="password"
              placeholder="Senha Atual"
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
            <Button className="w-5/6">
            <Image 
              src={iconFoto}
              width={25}
              height={25}
              alt="Alterar Foto"
            />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>

      {/* Div do histórico */}
      <div className="mt-5 w-[80%]">
        <Title mainTitle="Histórico de" subTitle="Planejamentos" />
        <Historico />
      </div>
    </div>
  );
};

export default HistoricoPage;
