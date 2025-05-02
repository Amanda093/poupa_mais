"use client";

import { EmailAuthProvider, reauthenticateWithCredential,signOut,updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button, Historico, Input, Title } from "@/components";
import placeholderFoto from "@/components/assets/FotoPerfilPlaceHolder.png";
import iconFoto from "@/components/assets/MudarFoto.png";
import password from "@/components/assets/password.png";
import { db } from "@/lib/clientApp";
import { auth } from "@/lib/clientApp";

const HistoricoPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState<string>(placeholderFoto.src); // Começa com o placeholder
  const [uploading, setUploading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");


  // Carregar a foto de perfil do Firebase ou localStorage sempre que o componente for montado
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
  
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const data = userSnap.data();
        setNome(data.nome || "");
        setEmail(data.email || "");
        setDataNascimento(
          data.dataNascimento
            ? new Date(data.dataNascimento.seconds * 1000).toISOString().split("T")[0]
            : ""
        );
      }
  
      const storedPhotoURL = localStorage.getItem("photoURL");
      if (storedPhotoURL) {
        setPhotoURL(storedPhotoURL); // do localStorage
      } else if (user.photoURL) {
        setPhotoURL(user.photoURL); // do Firebase Auth
      }
    };
  
    fetchUserData();
  }, [user]);

  const handleChangePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
  
    setUploading(true);
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
  
      try {
        await updateProfile(user, { photoURL: base64 });
        setPhotoURL(base64);
        localStorage.setItem("photoURL", base64);
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        alert("Erro ao atualizar foto de perfil.");
      } finally {
        setUploading(false);
      }
    };
  
    reader.readAsDataURL(file);
  };
  
  
  const handleSalvar = async () => {
    if (!user) return;
  
    try {
      // Reautenticação antes de qualquer mudança sensível
      if (novaSenha || email !== user.email) {
        if (!senhaAtual) {
          alert("Você precisa fornecer a senha atual para alterar email ou senha.");
          return;
        }
  
        const credential = EmailAuthProvider.credential(
          user.email! || "",
          senhaAtual
        );
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, email)
      }
  
      // Atualiza nome e foto
      await updateProfile(user, {
        displayName: nome,
        photoURL: user.photoURL || undefined,
      });
  
      // Atualiza email (se mudou)
      if (email !== user.email) {
        await updateEmail(user, email);
      }
  
      // Atualiza senha (se fornecida)
      if (novaSenha) {
        await updatePassword(user, novaSenha);
      }
  
      // Atualiza Firestore
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        nome,
        email,
        dataNascimento: new Date(dataNascimento),
      });
  
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao salvar dados:", error);
        alert("Erro ao salvar: " + error.message);
      } else {
        console.error("Erro desconhecido:", error);
        alert("Erro desconhecido ao salvar dados.");
      }
    }
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
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="komisan@email.com"
              variant="default"
              className="w-75"
            />
          </div>
          <div>
            <label htmlFor="data">Data de Nascimento</label>
            <Input 
            id="data" 
            type="date" 
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            variant="default" 
            className="w-75"
             />
          </div>
        </div>

        {/* Div com a segunda coluna de inputs */}
        <div className="mb-2 flex h-[33%] w-fit flex-col gap-[0.5em]">
          <div>
            <label htmlFor="novaSenha">Nova Senha</label>
            <Input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
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
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
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
            <Button className="" onClick={handleSalvar}>
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
