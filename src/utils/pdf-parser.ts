import { pdf } from "pdf-to-img";
import path from "path";
import fs from "fs";

import Archiver from "./Archiver";
import { checkDirAndCreate, getFileName } from "./fs-utils";
import archiver from "archiver";

export const uploadsDir = "uploads/";
export const tempDir = "temp";

const uploadsDirPath = path.resolve(uploadsDir);
checkDirAndCreate(uploadsDirPath);

export async function parseMultiplePdf(files: Express.Multer.File[], onResult) {
  const outputDirPath = path.join(uploadsDirPath, Date.now().toString()); // Unique folder
  checkDirAndCreate(outputDirPath);
  const outputDirImagesPath = path.join(outputDirPath, 'results'); // Unique folder
  checkDirAndCreate(outputDirImagesPath);
  for(let i =0; i < files.length; i++) {
    const file = files[i];
    const fileName = getFileName(file.originalname);
    const currentFileDirPath = path.join(outputDirImagesPath, fileName)
    checkDirAndCreate(currentFileDirPath);
    try{
      const document = await pdf(file.path, { scale: 3 });
      let counter = 1;
      for await (const image of document) {
        await fs.writeFile(`${currentFileDirPath}/page-${counter}.png`, image, () => {});
        counter++;
      }
    } catch(e) {
      console.log(e)
    }
  }
  const outputZipPath = path.join(outputDirPath, `convert-${Date.now()}.zip`);
  const output = fs.createWriteStream(outputZipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });
  output.on("close", () => {
    console.log(`✅ Archive created: ${archive.pointer()} total bytes`);
    onResult(outputZipPath, outputDirPath);
  });

  // archive.on("error", (err) => {
  //   reject(err);
  // });

  archive.pipe(output);

  archive.directory(outputDirImagesPath, false);

  archive.finalize();
}


export async function parsePdf(file: Express.Multer.File, onResult) {
  const filePath = file.path;
  const outputDirPath = path.join(uploadsDirPath, Date.now().toString()); // Unique folder
  const zipDirPath = path.join(outputDirPath, tempDir);
  const zipFilePath = path.join(zipDirPath, `${Date.now()}.zip`);

  checkDirAndCreate(outputDirPath);
  checkDirAndCreate(zipDirPath);

  try {
    // Convert PDF to images
    const document = await pdf(filePath, { scale: 3 });

    const archive = new Archiver(zipFilePath);

    archive.onFinish(onResult);

    archive.onError((error) => {
      console.log(error);
    });

    let counter = 1;
    for await (const image of document) {
      await fs.writeFile(`${outputDirPath}/page-${counter}.png`, image, () => {});
      archive.addFile(`${outputDirPath}/page-${counter}.png`, {
        name: path.basename(`${outputDirPath}/page-${counter}.png`),
      });
      counter++;
    }

    archive.finalize();
  } catch (error) {
    console.error(error);
    throw new Error({ error: "Conversion failed" });
  }
}
