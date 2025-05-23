import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { initDB } from "./db/db";

import convertRouter from "./controllers/convert-controller";
import userRouter from "./controllers/user-controller";
import authRouter from "./controllers/auth-controller";


await initDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(convertRouter);
app.use(userRouter);
app.use(authRouter)

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
