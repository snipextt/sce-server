import { Request as _Request, Response, Router } from "express";
import { verifyJWT } from "../middleware";
import { User } from "../models";

interface Request extends _Request {
  user?: {
    id: string;
  };
}

const profileHandler = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id)
    .select("-password")
    .populate("section")
    .populate({
      path: "section",
      populate: {
        path: "subjects",
        model: "subject",
      },
    });
  res.json(user);
};

const UserController = Router();

UserController.use(verifyJWT);

UserController.get("/profile", profileHandler);

export { UserController };
