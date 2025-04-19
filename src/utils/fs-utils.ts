import fs from "fs";

export function checkDirAndCreate(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

export function clearFiles(path: string) {
  fs.unlinkSync(path); // Cleanup after download
}

export function getFileName(fileName: string) {
  const chunkNames = fileName.split(".");
  return chunkNames[0] || "Untitled";
}
