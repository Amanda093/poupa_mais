import { User } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { Planejamento } from "@/types";

import { db } from "../services";

export const fetchUserData = async (
  user: User | null | undefined,
  setNome: React.Dispatch<React.SetStateAction<string>>,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setPhotoURL: React.Dispatch<React.SetStateAction<string>>,
) => {
  //se não houver usuário logado, retorna
  if (!user) return;

  //pega os dados do usuário no banco
  const userRef = doc(db, "usuarios", user.uid);
  const userSnap = await getDoc(userRef);

  //pega os dados do usuário e coloca-os nos inputs do historico/page.tsx
  if (userSnap.exists()) {
    const data = userSnap.data();
    setNome(data.nome || "");
    setEmail(data.email || "");
  }

  //pega a foto do cloudinary e utiliza-a no historico
  const storedPhotoURL = localStorage.getItem("photoURL");
  if (storedPhotoURL) {
    setPhotoURL(storedPhotoURL); // do localStorage
  } else if (user.photoURL) {
    setPhotoURL(user.photoURL); // do Firebase Auth
  }
};

export const fetchPlanejamentos = async (
  user: User | null | undefined,
  setPlanejamentos: React.Dispatch<React.SetStateAction<Planejamento[]>>,
) => {
  if (!user) return; //Caso o usuário não esteja logado a função termina

  const planejamentosRef = collection(
    //Acessa o banco e pega os planejamentos
    db,
    "usuarios",
    user.uid,
    "planejamentos",
  );
  const snapshot = await getDocs(planejamentosRef);

  //Mapeira todos os planejamentos retornados e converte eles em objetos
  const data: Planejamento[] = snapshot.docs.map((doc) => {
    const raw = doc.data();

    //objeto
    return {
      id: doc.id,
      custeio: {
        estado: raw.custeio.estado,
        gastos: raw.custeio.gastos,
        obs: raw.custeio.obs,
        renda: raw.custeio.renda,
        utilizavel: raw.custeio.utilizavel,
      },
      geradoEm: raw.geradoEm.toDate(),
      mensagemBot: raw.mensagemBot,
      mensagemJSON: raw.mensagemJSON,
    };
  });

  setPlanejamentos(data); //Armazena os planejamentos no useState de planejamentos
};
