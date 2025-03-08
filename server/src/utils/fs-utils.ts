import fs from "fs";

export function checkDirAndCreate(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
