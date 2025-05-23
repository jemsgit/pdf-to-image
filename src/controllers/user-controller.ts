import { Router, Response } from "express";
import { checkAuth } from "../service/auth-service";
import { RequestWithUser } from "../types/server";
import { getAnonimousUser, getUser, saveUser } from "../service/user-service";
import { UserNotFoundError } from "../errors/UserNotFound";
import { AnonUserNotFoundError } from "../errors/AnonUserNotFound";

const userRouter = Router();

userRouter.get(
    "/user",
    checkAuth,
    async (req: RequestWithUser, res: Response) => {
     
      try {
        let user;
        try {
          if(req.user.email) {
            user = await getUser(req.user.email);
          } else if(req.user.username) {
            user = await getAnonimousUser(req.user.username);
          }
        } catch(err) {
          console.log(err)
          if (err instanceof UserNotFoundError) {
            user = await saveUser(req.user.email)
          } else if (err instanceof AnonUserNotFoundError) {
            //user = await saveUser(req.user.username)
          }
        }
  
        if (!user) {
          return res.status(500).json({ error: "Something went wrong" });
        }
  
        res.send({
          email: user.email || user.anonUsername,
          convertionsCount: user.convertionsCount
        })
        
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
      }
    },
  );
  
export default userRouter;