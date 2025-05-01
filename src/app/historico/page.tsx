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

    // Criação do FormData e upload para o Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // Substitua pelo seu preset de upload no Cloudinary

    const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text(); // Lê como texto, caso não seja JSON
      console.error("Erro ao enviar imagem:", text);
      return;
    }

    const data = await response.json();
    console.log("Imagem enviada:", data.secure_url);

    if (response.ok) {
      // Atualiza a foto de perfil no Firebase
      await updateProfile(auth.currentUser!, {
        photoURL: data.secure_url,
      });

      // Atualiza o estado local da foto
      setPhotoURL(data.secure_url);

      // Armazena a foto no localStorage
      localStorage.setItem("photoURL", data.secure_url);
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
      <div className="flex gap-[2em]">
        <div className="flex w-max flex-col items-center gap-[0.5em]">
          <Image
            src={photoURL}
            alt="Profile Picture"
            className="aspect-square w-[8.5em] rounded-full border-3 border-emerald-500 object-cover"
            width={128}
            height={128}
            unoptimized
          />
          <Button onClick={handleChangePhotoClick} disabled={uploading}>
            <Image src={iconFoto} className="size-[1.25em]" alt="Alterar Foto" />
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
        <div className="mb-2 flex h-[33%] w-fit flex-col gap-[0.5em]">
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

      {/* Div do histórico */}
      <div className="flex w-full flex-col gap-[1em]">
        <Title mainTitle="Histórico de" subTitle="Planejamentos" />
        <Historico
          mes="Abril"
          ano="2025"
          despesas={[
            { cor: "bg-emerald-500", valor: 1500.00, titulo: "Alimentação" },
            { cor: "bg-pink-400", valor: 800.00, titulo: "Transporte" },
            { cor: "bg-red-500", valor: 1200.00, titulo: "Saúde" },
            { cor: "bg-indigo-500", valor: 500.00, titulo: "Lazer" }
          ]}
        />
        <Historico
          mes="Setembro"
          ano="2025"
          despesas={[
            { cor: "bg-emerald-500", valor: 1500.00, titulo: "Alimentação" },
            { cor: "bg-pink-400", valor: 800.00, titulo: "Transporte" },
            { cor: "bg-red-500", valor: 1200.00, titulo: "Saúde" },
            { cor: "bg-indigo-500", valor: 500.00, titulo: "Lazer" }
          ]}
        />
      </div>
    </div>
  );
};

export default HistoricoPage;
