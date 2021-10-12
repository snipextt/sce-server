import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { config } from "../_config";

const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const payload = {
    user: {
      id: user.id,
    },
  };
  jwt.sign(
    payload,
    config.get("jwtSecret")!,
    { expiresIn: "10h", issuer: "snipextt" },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};

export { loginHandler };
