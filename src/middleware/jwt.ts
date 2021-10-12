import jwt from "jsonwebtoken";
import { Request as _Request, Response, NextFunction } from "express";
import { config } from "../_config";

interface Request extends _Request {
  user?: {
    id: string;
  };
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.get("jwtSecret")!, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
          error: err,
        });
      }
      console.log(decoded);
      req.user! = (decoded as any).user;
      next();
    });
  } else {
    return res.status(401).json({
      message: "Auth token is not supplied",
    });
  }
};

export { verifyJWT };
