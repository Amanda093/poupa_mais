"use client";

import { format, isValid } from "date-fns";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { CalendarIcon, LucideEye, LucideEyeClosed } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  Button,
  Calendar,
  Historico,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Title,
} from "@/components";
import placeholderFoto from "@/components/assets/FotoPerfilPlaceHolder.png";
import iconFoto from "@/components/assets/MudarFoto.png";
import { db } from "@/lib/clientApp";
import { auth } from "@/lib/clientApp";
import { Popup, Toast } from "@/lib/sweetalert";
import { cn } from "@/lib/utils";

type Gasto = {
  categoria: string;
  nome: string;
  valor: string;
};

type Custeio = {
  estado: number;
  gastos: Gasto[];
  obs: string;
  renda: string;
};

type Planejamento = {
  id: string; // assumindo que o id do Firebase é uma string
  custeio: Custeio;
  geradoEm: Timestamp;
  mensagem: string; // mensagem do bot em markdown
};

const HistoricoPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user, loading] = useAuthState(auth);
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
  const router = useRouter();

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
        setDataNascimento(data.dataNascimento?.toDate?.() || undefined);
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

  useEffect(() => {
    const fetchPlanejamentos = async () => {
      if (!user) return;

      const planejamentosRef = collection(
        db,
        "usuarios",
        user.uid,
        "planejamentos",
      );
      const snapshot = await getDocs(planejamentosRef);

      const data: Planejamento[] = snapshot.docs.map((doc) => {
        const raw = doc.data();

        return {
          id: doc.id,
          custeio: {
            estado: raw.custeio.estado,
            gastos: raw.custeio.gastos,
            obs: raw.custeio.obs,
            renda: raw.custeio.renda,
          },
          geradoEm: raw.geradoEm.toDate(),
          mensagem: raw.mensagemBot,
        };
      });

      setPlanejamentos(data);
    };

    fetchPlanejamentos();
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

    // 1. Deleta imagem antiga (caso exista)
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

    // 3. Atualiza o Firebase, o localStorage e o estado
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
      // Reautenticação antes de mudanças sensíveis
      if (novaSenha || email !== user.email) {
        if (!senhaAtual) {
          Popup.fire({
            html: `<div><p>Você precisa fornecer a senha atual para alterar email ou senha.</p></div> `,
            icon: "warning",
          });
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email!,
          senhaAtual,
        );
        await reauthenticateWithCredential(user, credential);

        if (email !== user.email) {
          await updateEmail(user, email);
        }

        if (novaSenha) {
          await updatePassword(user, novaSenha);
        }
      }

      // Atualiza nome e foto
      await updateProfile(user, {
        displayName: nome,
        photoURL: user.photoURL || undefined,
      });

      // Atualiza Firestore
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        nome,
        email,
        dataNascimento,
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

      // Redirecionar para dashboard
      router.push("/");
      Toast.fire({
        title: "Logout realizado com sucesso!",
        icon: "success",
      });
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
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="data">Data de Nascimento</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "aria-expanded:emerald-glow w-75 justify-start rounded-[0.5em] bg-white !px-3 !py-[0.3em] text-left font-light text-gray-950 outline-slate-400 hover:text-gray-950 hover:outline-slate-400 active:outline-slate-400 aria-expanded:outline-emerald-500",
                      !dataNascimento && "text-slate-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {dataNascimento && isValid(dataNascimento) ? (
                      <span className="text-light">
                        {format(dataNascimento, "dd/MM/yyyy")}
                      </span>
                    ) : (
                      <span className="text-light text-slate-400">
                        Escolha a data
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataNascimento}
                    onSelect={setDataNascimento}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                className="w-75"
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
                className="w-75"
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

        {planejamentos.length > 0 ? (
          planejamentos.map((p) => (
            <Historico
              key={p.id}
              geradoEm={p.geradoEm.toLocaleString()}
              renda={p.custeio.renda}
              despesas={p.custeio.gastos}
              respostaIA={p.mensagem}
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
