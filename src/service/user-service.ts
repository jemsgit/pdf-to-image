import { createUser } from "../db/db";

export function saveUser(email: string) {
  return createUser(email);
}
