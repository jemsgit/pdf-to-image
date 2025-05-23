import fs from "fs";
import { rimraf } from 'rimraf'


export function checkDirAndCreate(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

export function clearFiles(path: string) {
  rimraf(path).then(e => console.log(e))
}

export function getFileName(fileName: string) {
  const chunkNames = fileName.split(".");
  return chunkNames[0] || "Untitled";
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9-_]/g, "X")             // Replace unsafe characters
    .toLowerCase();                              // Optional: lowercase for consistency
}