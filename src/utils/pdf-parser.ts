import { pdf } from "pdf-to-img";
import path from "path";
import fs from "fs";

import Archiver from "./Archiver";
import { checkDirAndCreate } from "./fs-utils";

const uploadsDir = "uploads/";
const tempDir = "temp";

const uploadsDirPath = path.resolve(uploadsDir);
checkDirAndCreate(uploadsDirPath);

export async function parsePdf(filePath: string, onResult) {
  const inputPath = filePath;
  const outputDirPath = path.join(uploadsDirPath, Date.now().toString()); // Unique folder
  const zipDirPath = path.join(outputDirPath, tempDir);
  const zipFilePath = path.join(zipDirPath, `${Date.now()}.zip`);

  checkDirAndCreate(outputDirPath);
  checkDirAndCreate(zipDirPath);

  try {
    // Convert PDF to images
    const document = await pdf(filePath, { scale: 3 });

    const archive = new Archiver(zipFilePath);

    //await fs.unlink(inputPath, () => {});

    archive.onFinish(onResult);

    archive.onError((error) => {
      console.log(error);
    });

    let counter = 1;
    for await (const image of document) {
      await fs.writeFile(`uploads/page-${counter}.png`, image, () => {});
      archive.addFile(`uploads/page-${counter}.png`, {
        name: path.basename(`uploads/page-${counter}.png`),
      });
      counter++;
    }

    archive.finalize();
  } catch (error) {
    console.error(error);
    throw new Error({ error: "Conversion failed" });
  }
}
