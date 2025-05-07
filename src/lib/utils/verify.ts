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
  if (user) {
    const userDocRef = doc(db, "usuarios", user.uid);
    const userDoc = await getDoc(userDocRef);

    const hoje = new Date();

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        usos: 0,
        ultimaGeracao: hoje.toISOString(),
      });
    } else {
      const data = userDoc.data();
      const ultima = new Date(data.ultimaGeracao);
      const dias = differenceInDays(hoje, ultima);

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
