import Image from "next/image";
import { FaOctopusDeploy } from "react-icons/fa";

import { Button, Input } from "@/components";

import Perfil from "../../../public/FotoPerfilPlaceHolder.png";
import iconFoto from "../../../public/MudarFoto.png";

const HistoricoPage = () => {
  return (
    //Div com que contem a todos os elementos
    <div className="h-auto">
      {/*Div de Perfil*/}
      <div className="flex w-full justify-center gap-30">
        {/*Div da foto de perfil*/}
        <div className="flex w-max flex-col items-center gap-5">
          {/*Foto do perfil*/}
          <Image
            src={Perfil}
            width={240}
            height={240}
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
            <p>Mudar Foto</p>
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

          <div>
            <label htmlFor="data" className="">
              Data
            </label>
            <Input
              id="data"
              placeholder="Komi San"
              variant="default"
              type="date"
            />
          </div>
        </div>

        {/*Div com a segunda coluna de inputs*/}
        <div className="mb-2 flex flex-col justify-between">
          <div>
            <label htmlFor="novaSenha" className="">
              Nova Senha
            </label>
            <Input
              id="novaSenha"
              type="password"
              placeholder="Nova Senha"
              variant="default"
            />
          </div>

          <div>
            <label htmlFor="senhaAtual" className="">
              Senha Atual
            </label>
            <Input
              id="senhaAtual"
              type="password"
              placeholder="Senha Atual"
              variant="default"
            />
          </div>

          <div>
            {/*Botão de alterar senha*/}
            <Button className="w-full">
              <Image
                src={iconFoto}
                width={25}
                height={25}
                alt="Profile Picture"
              />
              <p>Mudar Foto</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricoPage;
