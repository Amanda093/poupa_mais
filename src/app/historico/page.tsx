import Image from "next/image";

import { Button, Historico, Input, Title } from "@/components";

import Perfil from "../../../public/FotoPerfilPlaceHolder.png";
import iconFoto from "../../../public/MudarFoto.png";
import password from "../../../public/password.png";

const HistoricoPage = () => {
  return (
    // Div que contém todos os elementos
    <div className="container flex flex-col items-center gap-[3em] py-[45px] xl:!max-w-[1270px]">
      {/* Div de Perfil */}
      <div className="flex gap-[2em] max-lg:flex-col">
        {/* Div da foto de perfil */}
        <div className="flex w-max flex-col items-center gap-[0.5em] max-lg:w-full max-lg:justify-center">
          {/* Foto do perfil */}
          <Image
            src={Perfil}
            alt="Profile Picture"
            className="aspect-square w-[8.5em] rounded-full border-3 border-emerald-500"
          />

          {/* Botão de alterar foto de perfil */}
          <Button>
            <Image
              src={iconFoto}
              className="size-[1.25em]"
              alt="Alterar Foto"
            />
            Mudar Foto
          </Button>
        </div>

        {/*Div do formulario*/}
        <div className="flex gap-[2em] max-sm:flex-col max-sm:gap-0">
        {/* Div com a primeira coluna de inputs */}
        <div className="mb-2 flex w-fit flex-col gap-[0.5em]">
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
            <label htmlFor="data">Data de Nascimento</label>
            <Input id="data" type="date" variant="default" className="w-75" />
          </div>
        </div>

        {/* Div com a segunda coluna de inputs */}
        <div className="mb-2 flex w-fit flex-col gap-[0.5em]">
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
          <div className="h-[33%]">
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
          <div className="flex h-[3.5em] items-end gap-[1em]">
            <Button className="">
              <Image
                src={iconFoto}
                className="size-[1.25em]"
                alt="Alterar Foto"
              />
              Salvar
            </Button>
            <Button variant="delete" className="">
              Sair
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* Div do histórico */}
      <div className="flex w-full flex-col gap-[1em]">
        <Title mainTitle="Histórico de" subTitle="Planejamentos" />
        <Historico mes="Abril" ano="2025" />
        <Historico mes="Setembro" ano="2024" />
      </div>
    </div>
  );
};

export default HistoricoPage;
