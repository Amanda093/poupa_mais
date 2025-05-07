import { v2 as cloudinary } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

//configura o cloudinary para usar a cloud do admin
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    //se o método requerido pelo historico/page.tsx não for post, bloqueia o resto do código
    return res.status(405).json({ error: "Método não permitido" });
  }

  //armazena o public_id como req.body (utiliza-se req.body pois o clientside historico/page.tsx está enviando e recebendo informação de um serverside privado pages/api/deleteImage.ts)
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "public_id não fornecido" });
  }

  try {
    //destrói a imagem do usuário anteriormente armazenada no cloudinary
    const result = await cloudinary.uploader.destroy(public_id);
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    return res.status(500).json({ error: "Erro interno ao deletar imagem" });
  }
}
