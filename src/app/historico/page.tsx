"use client";

import { signOut, updateProfile } from "firebase/auth";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button, Historico, Input, Title } from "@/components";
import placeholderFoto from "@/components/assets/FotoPerfilPlaceHolder.png";
import iconFoto from "@/components/assets/MudarFoto.png";
import password from "@/components/assets/password.png";
import { auth } from "@/lib/clientApp";

const HistoricoPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState<string>(placeholderFoto.src); // Começa com o placeholder
  const [uploading, setUploading] = useState(false);

  // Carregar a foto de perfil do Firebase ou localStorage sempre que o componente for montado
  useEffect(() => {
    const storedPhotoURL = localStorage.getItem("photoURL");

    if (storedPhotoURL) {
      // Se a foto estiver no localStorage, usa ela
      setPhotoURL(storedPhotoURL);
    } else if (user && user.photoURL) {
      // Se a foto estiver no Firebase, usa ela
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click(); // Abre seletor de arquivo
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 1. Deleta imagem antiga (se existir)
    const oldPublicId = localStorage.getItem("photoPublicId");
    if (oldPublicId) {
      await fetch("/api/deleteImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: oldPublicId }),
      });
      localStorage.removeItem("photoPublicId"); // Limpa o antigo
    }

    // 2. Faz upload da nova imagem
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Nova imagem enviada:", data);

    // 3. Atualiza Firebase, localStorage e estado
    if (response.ok) {
      await updateProfile(auth.currentUser!, {
        photoURL: data.secure_url,
      });

      setPhotoURL(data.secure_url);
      localStorage.setItem("photoURL", data.secure_url);
      localStorage.setItem("photoPublicId", data.public_id); // Salva o novo public_id
    }

    setUploading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("photoURL"); // Remove a foto ao deslogar
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
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
            onChange={handleFileChange}
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
              <Button variant="delete" className="" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Div do histórico */}
      <div className="flex w-full flex-col gap-[1em]">
        <Title mainTitle="Histórico de" subTitle="Planejamentos" />
        <Historico
          mes="Abril"
          ano="2025"
          renda="R$4500,00"
          despesas={[
            {
              categoria: "Alimentação",
              valor: 1500.0,
              nome: "Comida",
            },
            { categoria: "Transporte", valor: 800.0, nome: "Onibus" },
            { categoria: "Saúde", valor: 1200.0, nome: "Médico" },
            { categoria: "Lazer", valor: 500.0, nome: "Jogos" },
          ]}
        />
        <Historico
          mes="Setembro"
          ano="2025"
          renda="R$4500,00"
          despesas={[
            {
              categoria: "Alimentação",
              valor: 1500.0,
              nome: "Comida",
            },
            { categoria: "Transporte", valor: 800.0, nome: "Onibus" },
            { categoria: "Saúde", valor: 1200.0, nome: "Médico" },
            { categoria: "Lazer", valor: 500.0, nome: "Jogos" },
          ]}
        />
      </div>
    </div>
  );
};

export default HistoricoPage;
