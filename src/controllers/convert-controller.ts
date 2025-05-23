import { Router, Response } from "express";
import { checkAuth } from "../service/auth-service";
import { initFileMiddleware } from "../service/file-storage";
import { RequestWithUser } from "../types/server";
import { getAnonimousUser, getUser, incrementUserConvertions, saveAnonUser, saveUser } from "../service/user-service";
import { UserNotFoundError } from "../errors/UserNotFound";
import { AnonUserNotFoundError } from "../errors/AnonUserNotFound";
import { convertPdfs } from "../service/pdf-convert-service";
import { clearFiles } from "../utils/fs-utils";

const convertRouter = Router();
const upload = initFileMiddleware();

convertRouter.post(
    "/convert",
    checkAuth,
    upload.array("pdfs"),
    async (req: RequestWithUser, res: Response) => {
      if (!req.files || !(req.files instanceof Array)) {
        return res.status(400).json({ error: "No files uploaded" });
      }
  
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
          if (err instanceof UserNotFoundError && req.user.email) {
            user = await saveUser(req.user.email)
          } else if (err instanceof AnonUserNotFoundError) {
            user = await saveAnonUser(req.user.username)
          }
        }
  
        if(!user) {
          return res.status(500).json({ error: "Conversion failed" });
        }
        const { path: resPath, folder, name } = await convertPdfs(req.files);
  
        res.download(resPath, name, () => {
          clearFiles(folder);
          req.files?.forEach(file => {
            clearFiles(file.path)
          })
        });
        incrementUserConvertions(1, user.email, user.anonUsername)
      } catch (error) {
        req.files?.forEach(file => {
          clearFiles(file.path)
        })
        return res.status(500).json({ error: "Conversion failed" });
      }
    },
  );

export default convertRouter;