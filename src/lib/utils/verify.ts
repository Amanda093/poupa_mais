import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services";
import { differenceInDays } from "date-fns";
import { User } from "firebase/auth";

export const verificarLimite = async (
  user: User | null | undefined,
  setLimitado: Function,
) => {
  //se o usuário estiver logado, pega os dados dele do banco baseado em seu token
  if (user) {
    const userDocRef = doc(db, "usuarios", user.uid);
    const userDoc = await getDoc(userDocRef);

    //pega a data atual
    const hoje = new Date();

    //se o usuário for completamente novo, gera valores iniciais para ele
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        usos: 0,
        ultimaGeracao: hoje.toISOString(),
      });
    } else {
      //se não, utiliza os dados mais atuais
      const data = userDoc.data();
      const ultima = new Date(data.ultimaGeracao);
      const dias = differenceInDays(hoje, ultima);

      //se passar de 7 dias sem uso do usuário, reseta seus usos para 0 (limita o uso por semana)
      if (dias >= 7) {
        await updateDoc(userDocRef, {
          usos: 0,
          ultimaGeracao: hoje.toISOString(),
        });
      } else if (data.usos >= 3) {
        setLimitado(true);
      }
    }
  }
};

//essa função verifica se há algum planejamento anterior ao que o usuário está fazendo agora, pegando do Firestore os dados da coleção
export const verificarSePlanejamentoAnterior = async (
  user: User | null | undefined,
  setMostrarCheck: Function,
) => {
  if (user) {
    const userDocRef = doc(db, "usuarios", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const planejamentosRef = collection(
        db,
        "usuarios",
        user.uid,
        "planejamentos",
      );

      const q = query(planejamentosRef);
      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        setMostrarCheck(true);
      } else {
        setMostrarCheck(false);
      }
    }
  }
};
