import { signOut } from "firebase/auth";
import { auth } from "../services";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Toast } from "../utils";

export const handleLogout = async (router: AppRouterInstance) => {
  try {
    //desloga o usuário do site
    await signOut(auth);
    localStorage.removeItem("photoURL"); // Remove a foto ao deslogar

    // Redireciona para a dashboard
    router.push("/");
    Toast.fire({
      title: "Logout realizado com sucesso!",
      icon: "success",
    });
  } catch (error) {
    //se não der certo, retorna no console
    console.error("Erro ao sair da conta:", error);
  }
};
