import PocketBase, { RecordModel } from "pocketbase";

let pb: PocketBase | null = null;

export async function initDB() {
  const POCKETBASE_URL = process.env.POCKETBASE_URL;
  pb = new PocketBase(POCKETBASE_URL);
  await pb.collection('_superusers').authWithPassword(
    "jemguns@gmail.com",
    "Jack15admin!",
    { cache: "no-store" }
  );
}

export interface User extends RecordModel {
  email: string;
  convertionsCount: number;
  subscriptionExpiration: string;
}

export interface FileRecord extends RecordModel {
  email: string;
  file: File;
}

export async function getUser(email: string): Promise<User> {
  const record = await pb
    .collection("extension_users")
    .getFirstListItem(`email="${email}"`, { requestKey: null });
  console.log(record)
  return record as User
}

export async function createUser(email: string): Promise<User> {
  const record = await pb.collection("extension_users").create({
    email,
    convertionsCount: 0,
    subscriptionExpiration: null,
  });
  console.log(record)
  return record;
}

export async function saveFile(email: string, file: File) {
  const record = await pb.collection("files").create({
    email,
    file,
  });
}

export async function setUserConvertions(userId: RecordModel['id'], convertionsCount: number) {
  await pb.collection("extension_users").update(userId, {convertionsCount })
}