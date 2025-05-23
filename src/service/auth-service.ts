import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./oauth-service";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    verifyToken(req, res, next);
    return;
  }
  const username = req.headers['x-username'] as string;

  if (!username) return res.status(401).send('Missing tokens');
  req.user = { username: username };

  next()
}
