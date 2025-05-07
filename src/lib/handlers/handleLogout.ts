import { signOut } from "firebase/auth";
import { auth } from "../services";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Toast } from "../utils";

export const handleLogout = async (router: AppRouterInstance) => {
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
