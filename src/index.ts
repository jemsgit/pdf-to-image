import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { convertPdfs } from "./service/pdf-convert-service";
import { clearFiles } from "./utils/fs-utils";
import { verifyToken } from "./service/oauth-service";
import { initFileMiddleware } from "./service/file-storage";
import { getUser, incrementUserConvertions, saveUser } from "./service/user-service";
import { initDB } from "./db/db";
import { UserNotFoundError } from "./errors/UserNotFound";

await initDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const upload = initFileMiddleware();

app.post(
  "/convert",
  verifyToken,
  upload.array("pdfs"),
  async (req: Request, res: Response) => {
    if (!req.files || !(req.files instanceof Array)) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    try {
      let user;
      try {
        user = await getUser(req.user.email);
      } catch(err) {
        if (err instanceof UserNotFoundError) {
          user = await saveUser(req.user.email)
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
      incrementUserConvertions(user.email, 1)
    } catch (error) {
      req.files?.forEach(file => {
        clearFiles(file.path)
      })
      return res.status(500).json({ error: "Conversion failed" });
    }
  },
);

app.get(
  "/user",
  verifyToken,
  async (req: Request, res: Response) => {
   
    try {
      let user;
      try {
        user = await getUser(req.user.email);
      } catch(err) {
        if (err instanceof UserNotFoundError) {
          user = await saveUser(req.user.email)
        }
      }

      if (!user) {
        return res.status(500).json({ error: "Something went wrong" });
      }

      res.send({
        email: user.email,
        convertionsCount: user.convertionsCount
      })
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`1Server running on http://localhost:${PORT}`),
);
