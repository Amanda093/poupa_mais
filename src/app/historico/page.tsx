"use client";

import { LucideEye, LucideEyeClosed } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button, Historico, Input, Title } from "@/components";
import placeholderFoto from "@/components/assets/FotoPerfilPlaceHolder.png";
import iconFoto from "@/components/assets/MudarFoto.png";
import DatePicker from "@/components/ui/DatePicker/date-picker";
import { handleFileChange, handleLogout, handleSalvar } from "@/lib/handlers";
import { auth } from "@/lib/services/clientApp";
import {
  fetchPlanejamentos,
  fetchUserData,
  verificarForcaSenha,
} from "@/lib/utils";
import { setTitle } from "@/lib/utils/setTitle";
import { Planejamento } from "@/types";

//Const que armazena todo o código da página de histórico
const HistoricoPage = () => {
  useEffect(() => {
    setTitle("Histórico");
  });
  //Hook para um elemento nulo ou input de html
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  //Armazena o usuário logado
  const [user, loading] = useAuthState(auth);

  //Use states usados ao longo da página
  const [photoURL, setPhotoURL] = useState<string>(placeholderFoto.src); // Começa com o placeholder
  const [uploading, setUploading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = React.useState<Date>();
  const [novaSenha, setNovaSenha] = useState("");
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([]);

  //Const de router
  const router = useRouter();

  const forcaSenha = verificarForcaSenha(novaSenha);

  //Expulsa o usuario da página caso ele não estja logado
  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Carregar a foto de perfil do Firebase ou localStorage sempre que o componente for montado
  useEffect(() => {
    fetchUserData(user, setNome, setEmail, setDataNascimento, setPhotoURL);
  }, [user]);

  //Busca os planejamentos do usuário no banco de dados
  useEffect(
    () => {
      fetchPlanejamentos(user, setPlanejamentos);
    },
    [user] /*Com que o useEffect seja executado sempre que o compnente for*/,
  );

  const handleChangePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container flex flex-col items-center gap-[3em] py-[45px] xl:!max-w-[1270px]">
      {/* Div de Perfil */}
      <div className="flex gap-[2em] max-lg:flex-col">
        {/* Div da foto de perfil */}
        <div className="flex w-max flex-col items-center gap-[0.5em] max-lg:w-full max-lg:justify-center">
          {/* Foto do perfil */}
          <Image
            src={photoURL}
            alt="Profile Picture"
            className="aspect-square w-[8.5em] rounded-full border-3 border-emerald-500 object-cover"
            width={128}
            height={128}
            unoptimized
          />
          <Button onClick={handleChangePhotoClick} disabled={uploading}>
            <Image
              src={iconFoto}
              className="size-[1.25em]"
              alt="Alterar Foto"
            />
            {uploading ? "Enviando..." : "Mudar Foto"}
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              handleFileChange(e, setUploading, setPhotoURL, router);
            }}
          />
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
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome..."
                variant="default"
                className="w-75"
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                variant="default"
                className="w-75"
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="data">Data de Nascimento</label>
              <DatePicker
                id="datadenascimento"
                value={dataNascimento}
                onChange={(d) => setDataNascimento(d)}
              />
            </div>
          </div>

          {/* Div com a segunda coluna de inputs */}
          <div className="mb-2 flex w-fit flex-col gap-[0.5em]">
            <div>
              <label htmlFor="novaSenha">Nova Senha</label>
              <Input
                id="novaSenha"
                type={showNovaSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Nova Senha"
                variant="default"
                className={`w-75 ${forcaSenha === "Fraca" ? "focus:!rose-glow focus:outline-rose-500" : forcaSenha === "Média" ? "focus:!amber-glow focus:outline-amber-500" : ""}`}
                icon={
                  showNovaSenha ? (
                    <LucideEye
                      className="size-[1em] cursor-pointer select-none"
                      onClick={() => setShowNovaSenha((prev) => !prev)}
                    />
                  ) : (
                    <LucideEyeClosed
                      className="size-[1em] cursor-pointer select-none"
                      onClick={() => setShowNovaSenha((prev) => !prev)}
                    />
                  )
                }
              />
            </div>
            <div className="h-[33%]">
              <label htmlFor="senhaAtual">Senha Atual</label>
              <Input
                id="senhaAtual"
                type={showSenhaAtual ? "text" : "password"}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="Senha Atual"
                variant="default"
                className={`w-75 ${forcaSenha === "Fraca" ? "focus:!rose-glow focus:outline-rose-500" : forcaSenha === "Média" ? "focus:!amber-glow focus:outline-amber-500" : ""}`}
                icon={
                  showSenhaAtual ? (
                    <LucideEye
                      className="size-[1em] cursor-pointer select-none"
                      onClick={() => setShowSenhaAtual((prev) => !prev)}
                    />
                  ) : (
                    <LucideEyeClosed
                      className="size-[1em] cursor-pointer select-none"
                      onClick={() => setShowSenhaAtual((prev) => !prev)}
                    />
                  )
                }
              />
            </div>
            <div className="flex h-[3.5em] items-end gap-[1em]">
              <Button
                className=""
                onClick={() => {
                  handleSalvar(
                    user,
                    novaSenha,
                    senhaAtual,
                    nome,
                    email,
                    forcaSenha,
                    dataNascimento,
                  );
                }}
              >
                Salvar
              </Button>
              <Button
                variant="delete"
                className="rounded-[0.75em] py-[0.35em] outline-offset-[-0.15em]"
                onClick={() => {
                  handleLogout(router);
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Div do histórico */}
      <div className="flex w-full flex-col gap-[1em]">
        <Title mainTitle="Histórico de" subTitle="Planejamentos" />

        {planejamentos.length > 0 ? (
          [...planejamentos]
            .sort((a, b) => {
              const dateA = new Date(a.geradoEm.toString()).getTime();
              const dateB = new Date(b.geradoEm.toString()).getTime();
              return dateB - dateA; // ordem decrescente
            })
            .map((p) => (
              <Historico
                key={p.id}
                geradoEm={p.geradoEm.toString()}
                renda={p.custeio.renda}
                despesas={p.custeio.gastos}
                respostaIA={p.mensagemBot}
              />
            ))
        ) : (
          <p className="text-light text-center text-gray-500">
            Nenhum planejamento encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoricoPage;
