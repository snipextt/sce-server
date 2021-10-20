import express from "express";
import cors from "cors";
import { AuthController, UserController } from "../controlers/";

const ExpressApp = express();

ExpressApp.use(express.json());
ExpressApp.use(cors());

ExpressApp.use("/auth", AuthController);

ExpressApp.use("/user", UserController);

export { ExpressApp };
