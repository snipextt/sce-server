import { model, Schema } from "mongoose";

interface IUser extends Document {
  id: number;
  name: string;
  email: string;
  password: string;
  type: string;
  phone: Number;
  gender: string;
  registrationNumber: string;
  notifications: null;
  section: string;
}

const UserModel = new Schema<IUser>({
  id: Number,
  name: String,
  email: String,
  password: String,
  type: String,
  phone: Number,
  gender: String,
  registrationNumber: String,
  section: Schema.Types.ObjectId,
});

const User = model<IUser>("student", UserModel);

export { User, IUser };
