import path from "path";
import { getFileName } from "../utils/fs-utils";
import { parseMultiplePdf, parsePdf } from "../utils/pdf-parser";

function convertSinglePdf(file: Express.Multer.File) {
  const fileName = getFileName(file.originalname);
  return new Promise((res, rej) =>
    parsePdf(file, (resPath) => {
      res({ path: resPath, name: `${fileName}-converted.zip` });
    }),
  );
}

export async function convertPdfs(files: Express.Multer.File[]) {
   // Unique folder
   return new Promise((res, rej) =>
    parseMultiplePdf(files, (zipPath, resultFolder) => {
      res({ path: zipPath, folder: resultFolder, name: `1-converted.zip` });
    }
  ))
}
