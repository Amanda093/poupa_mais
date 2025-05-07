import { v2 as cloudinary } from "cloudinary";
import formidable, { Fields, Files } from "formidable";
import { IncomingMessage } from "http";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

//configura o cloudinary para utilizar a cloud do admin
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

//essa função é utilizada para processar dados enviados como arquivos, prometendo os dados do usuário se a função form.parse for bem sucedida e não houver erro
const parseForm = (
  req: IncomingMessage,
): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //se o método requerido por historico/pages.jsx não for post, bloqueia o resto do código
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    //verifica o parseForm e pega o arquivo enviado pelo usuário
    const { files } = await parseForm(req);
    const uploadedFile = files.file;
    console.log("files:", files);

    //se não houver arquivo, retorna
    if (!uploadedFile) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    //se for mais de um arquivo, se assegura de pegar apenas o primeiro arquivo selecionado, e se não houver caminho pro arquivo dito pelo usuário ele retorna
    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    if (!("filepath" in file)) {
      return res.status(400).json({ error: "Arquivo inválido." });
    }

    const filePath = file.filepath;

    //manda o arquivo selecionado pro cloudinary, se tudo estiver correto, e retorna
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "avatars",
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ "Erro ao enviar imagem": error });
  }
}
