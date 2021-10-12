import express from "express";
import { AuthController, UserController } from "../controlers/";

const ExpressApp = express();

ExpressApp.use(express.json());

ExpressApp.use("/auth", AuthController);

ExpressApp.use("/user", UserController);

export { ExpressApp };
