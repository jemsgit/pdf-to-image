import { Router, Response } from "express";
import { RequestWithUser } from "../types/server";
import { createAnonymousUser, linkAnonUser } from "../service/user-service";
import { verifyToken } from "../service/oauth-service";

const authRouter = Router();

authRouter.post('/auth/anonymous', async (req, res) => {
  const user = await createAnonymousUser();

  res.json({ username: user.anonUsername });
});

authRouter.post('/auth/link', verifyToken, async (req: RequestWithUser, res: Response) => {
  const pbUsername = req.headers['x-username'] as string;

  if (!pbUsername) return res.status(400).send('Missing username token');
  if (!req.user.email) return res.status(400).send('Missing oauth token');


  const email = req.user.email;
  let linkedUser;

  try {
    linkedUser = await linkAnonUser(email, pbUsername)
  } catch(e) {
    // TODO another status code ?
    res.status(200).json({ success: false });
    return;
  }

  res.status(200).json({ success: true, user: { email: linkedUser?.email, convertionsCount: linkedUser?.convertionsCount } });
});
  
export default authRouter;