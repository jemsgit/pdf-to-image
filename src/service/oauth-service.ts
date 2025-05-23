import axios from 'axios';
import { NextFunction, Request, Response } from 'express';


export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
  const SKIP_AUTH = process.env.SKIP_AUTH_CHECK === '1'
  if (SKIP_AUTH) {
    req.user = {
      email: 'test@gmail.com',
    }
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );

    if (data.aud !== CLIENT_ID) {
      return res.status(403).json({ error: "Invalid client ID" });
    }

    req.user = {
      id: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
}
