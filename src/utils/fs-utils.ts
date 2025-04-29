import fs from "fs";
import { rimraf, rimrafSync, native, nativeSync } from 'rimraf'


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
  return sanitizeFileName(chunkNames[0]) || "Untitled";
}

export function sanitizeFileName(name: string): string {
  return name
    .normalize("NFKD")                           // Normalize accented characters
    .replace(/[\u0300-\u036F]/g, "")             // Remove diacritics
    .replace(/[^a-zA-Z0-9-_]/g, "_")             // Replace unsafe characters
    .toLowerCase();                              // Optional: lowercase for consistency
}