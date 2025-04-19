import { getFileName } from "../utils/fs-utils";
import { parsePdf } from "../utils/pdf-parser";

export function convertPdf(file) {
  const fileName = getFileName(file.originalname);
  return new Promise((res, rej) =>
    parsePdf(file.path, (resPath) => {
      res({ path: resPath, name: `${fileName}-converted.zip` });
    }),
  );
}
