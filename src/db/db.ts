import Pocketbase, { RecordModel } from "pocketbase";

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const pb = new PocketBase(POCKETBASE_URL);

export interface User extends RecordModel {
  email: string;
  convertionsCount: number;
  subscriptionExpiration: string;
}

export interface FileRecord extends RecordModel {
  email: string;
  file: File;
}

export async function getUser(email: string) {
  const record = await pb
    .collection("extension_users")
    .getFirstListItem(`email="${email}"`);
}

export async function createUser(email: string) {
  const record = await pb.collection("extension_users").create({
    email,
    convertionsCount: 0,
    subscriptionExpiration: null,
  });
}

export async function saveFile(email: string, file: File) {
  const record = await pb.collection("files").create({
    email,
    file,
  });
}
