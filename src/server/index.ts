import express from "express";
import { loginHandler } from "../controlers";

const ExpressApp = express();

ExpressApp.use(express.json());

ExpressApp.post("/login", loginHandler);

export { ExpressApp };
