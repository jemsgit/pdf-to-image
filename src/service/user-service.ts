import { ClientResponseError } from "pocketbase";
import { createUser, getUser as getUserDb, setUserConvertions } from "../db/db";
import { UserNotFoundError } from "../errors/UserNotFound";

export async function saveUser(email: string) {
  return createUser(email);
}

export async function getUser(email: string) {
  try {
    const user = await getUserDb(email);
    return user;
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 404) {
      throw new UserNotFoundError(email);
    }
    throw err;
  }
}

export async function incrementUserConvertions(email: string, count: number) {
  let user = await getUserDb(email);
  const newCount = user.convertionsCount + count;
  setUserConvertions(user.id, newCount);
}