import { updateProfile } from "firebase/auth";
import { auth } from "../services";
import { useRouter } from "next/navigation";
import { Toast } from "../utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setUploading: Function,
  setPhotoURL: Function,
  router: AppRouterInstance, // tipagem recomendada
) => {
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
