import { v2 as cloudinary } from "cloudinary";
import formidable, { Fields, Files } from "formidable";
import { IncomingMessage } from "http";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const parseForm = (
  req: IncomingMessage
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
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const { files } = await parseForm(req);
    const uploadedFile = files.file;
    console.log("files:", files);

    if (!uploadedFile) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    if (!("filepath" in file)) {
    return res.status(400).json({ error: "Arquivo inválido." });
    }

    const filePath = file.filepath;


    const result = await cloudinary.uploader.upload(filePath, {
      folder: "avatars",
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ "Erro ao enviar imagem": error});
  }
}
