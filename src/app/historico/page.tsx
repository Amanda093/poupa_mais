"use client";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button, Historico, Input, Title } from "@/components";
import placeholderFoto from "@/components/assets/FotoPerfilPlaceHolder.png";
import iconFoto from "@/components/assets/MudarFoto.png";
import password from "@/components/assets/password.png";
import { db } from "@/lib/clientApp";
import { auth } from "@/lib/clientApp";
import { Popup, Toast } from "@/lib/sweetalert";

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
  const router = useRouter();

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
            ? new Date(data.dataNascimento.seconds * 1000)
                .toISOString()
                .split("T")[0]
            : "",
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

    router.refresh();

    Toast.fire({
      title: "Foto atualizada com sucesso!",
      icon: "success",
    });
  };

  const handleSalvar = async () => {
    if (!user) return;

    try {
      // Reautenticação antes de qualquer mudança sensível
      if (novaSenha || email !== user.email) {
        if (!senhaAtual) {
          Popup.fire({
            html: `<div><p>Você precisa fornecer a senha atual para alterar email ou senha.</p></div> `,
            icon: "warning",
          });
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email! || "",
          senhaAtual,
        );
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, email);
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

      Toast.fire({
        title: "Dados atualizados com sucesso!",
        icon: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao salvar dados:", error);
        Popup.fire({
          html: `<div><p>Erro ao salvar:</p><b>${error.message}<b/></div> `,
          icon: "error",
        });
      } else {
        console.error("Erro desconhecido:", error);
        Popup.fire({
          html: `<div><p>Erro desconhecido ao salvar dados.</p></div> `,
          icon: "error",
        });
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
              />
            </div>
            <div>
              <label htmlFor="data">Data de Nascimento</label>
              <Input
                id="data"
                type="date"
                variant="default"
                className="w-75"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>
          </div>

          {/* Div com a segunda coluna de inputs */}
          <div className="mb-2 flex w-fit flex-col gap-[0.5em]">
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
                    className="size-[1em]"
                  />
                }
              />
            </div>
            <div className="flex h-[3.5em] items-end gap-[1em]">
              <Button className="" onClick={handleSalvar}>
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
            { categoria: "Transporte", valor: 800.0, nome: "Ônibus" },
            { categoria: "Saúde", valor: 1200.0, nome: "Médico" },
            { categoria: "Lazer", valor: 500.0, nome: "Jogos" },
          ]}
          respostaIA="Com base nos dados fornecidos, podemos elaborar um plano de economia para o usuário. 

            1. **Estimativa de economia mensal**: Considerando que o usuário tem uma renda mensal de R$ 1.000,00 e gasta R$ 200,00 com comida, podemos estimar que o usuário tem um potencial de economia mensal de R$ 800,00. No entanto, é importante considerar que o usuário provavelmente tem outros gastos, como moradia, transporte, etc. Uma estimativa mais realista seria de 20% a 30% da renda, o que daria R$ 200,00 a R$ 300,00 por mês.

            2. **Sugestões de corte de gastos**: Além da comida, que já é um gasto essencial, o usuário pode considerar cortar gastos em outras áreas, como:
              - Reduzir o uso de serviços de streaming e entretenimento.
              - Economizar na conta de telefone e internet.
              - Reduzir o consumo de produtos não essenciais.

            3. **Metas de curto, médio e longo prazo**:
              - **Curto prazo (1-3 meses)**: Criar um fundo de emergência com 1-2 meses de despesas.
              - **Médio prazo (6-12 meses)**: Aumentar a renda através de um segundo emprego, freelancer ou curso de capacitação.
              - **Longo prazo (1-5 anos)**: Investir em um plano de previdência ou um fundo de investimento para a aposentadoria.

            4. **Dicas de investimento**: Com a taxa Selic em 0,052531%, os investimentos em renda fixa podem não ser muito atraentes. No entanto, o usuário pode considerar investir em:
              - Fundos de investimento em ações.
              - Fundos de investimento imobiliário.
              - Plano de previdência."
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
            { categoria: "Transporte", valor: 800.0, nome: "Ônibus" },
            { categoria: "Saúde", valor: 1200.0, nome: "Médico" },
            { categoria: "Lazer", valor: 500.0, nome: "Jogos" },
          ]}
          respostaIA="Com base nos dados fornecidos, podemos elaborar um plano de economia para o usuário. 

            1. **Estimativa de economia mensal**: Considerando que o usuário tem uma renda mensal de R$ 1.000,00 e gasta R$ 200,00 com comida, podemos estimar que o usuário tem um potencial de economia mensal de R$ 800,00. No entanto, é importante considerar que o usuário provavelmente tem outros gastos, como moradia, transporte, etc. Uma estimativa mais realista seria de 20% a 30% da renda, o que daria R$ 200,00 a R$ 300,00 por mês.

            2. **Sugestões de corte de gastos**: Além da comida, que já é um gasto essencial, o usuário pode considerar cortar gastos em outras áreas, como:
              - Reduzir o uso de serviços de streaming e entretenimento.
              - Economizar na conta de telefone e internet.
              - Reduzir o consumo de produtos não essenciais.

            3. **Metas de curto, médio e longo prazo**:
              - **Curto prazo (1-3 meses)**: Criar um fundo de emergência com 1-2 meses de despesas.
              - **Médio prazo (6-12 meses)**: Aumentar a renda através de um segundo emprego, freelancer ou curso de capacitação.
              - **Longo prazo (1-5 anos)**: Investir em um plano de previdência ou um fundo de investimento para a aposentadoria.

            4. **Dicas de investimento**: Com a taxa Selic em 0,052531%, os investimentos em renda fixa podem não ser muito atraentes. No entanto, o usuário pode considerar investir em:
              - Fundos de investimento em ações.
              - Fundos de investimento imobiliário.
              - Plano de previdência."
        />
      </div>
    </div>
  );
};

export default HistoricoPage;
