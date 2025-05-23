import { ClientResponseError } from "pocketbase";
import { createUser, getUser as getUserDb, setUserConvertions, createAnonymousUser as createAnonymousUserDb, getAnonUser, setEmailToAnonUser, User } from "../db/db";
import { UserNotFoundError } from "../errors/UserNotFound";
import { AnonUserNotFoundError } from "../errors/AnonUserNotFound";
import { UserAlreadyExists } from "../errors/UserAlreadyExists";

export async function saveUser(email: string) {
  return createUser(email);
}

export async function saveAnonUser(username: string) {
  return createAnonymousUserDb(username);
}

export async function createAnonymousUser() {
  const username = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return createAnonymousUserDb(username);
}

export async function linkAnonUser(email: string, username: string): Promise<User | undefined>  {
  let user;
  let anonUser;
  try {
    user = await getUserDb(email);
    throw new UserAlreadyExists(email)
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 404) {
      try {
        anonUser = await getAnonUser(username);
        const updatedUser = await setEmailToAnonUser(anonUser.id, email);
        return updatedUser as User;
      } catch (e) {
        if (e instanceof ClientResponseError && err.status === 404) {
          throw new AnonUserNotFoundError(username);
        }
      }
    } else {
      throw err;
    }
  }
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

export async function getAnonimousUser(email: string) {
  try {
    const user = await getAnonUser(email);
    return user;
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 404) {
      throw new AnonUserNotFoundError(email);
    }
    throw err;
  }
}

export async function incrementUserConvertions(count: number, email?: string, username?: string) {
  let user;
  if(email) {
    user = await getUserDb(email);
  } else if (username) {
    user = await getAnonUser(username);
  }
  const newCount = user.convertionsCount + count;
  setUserConvertions(user.id, newCount);
}