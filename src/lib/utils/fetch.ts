import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../services";
import { User } from "firebase/auth";
import { Planejamento } from "@/types";

export const fetchUserData = async (
  user: User | null | undefined,
  setNome: Function,
  setEmail: Function,
  setDataNascimento: Function,
  setPhotoURL: Function,
) => {
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

export const fetchPlanejamentos = async (
  user: User | null | undefined,
  setPlanejamentos: Function,
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
