import { model, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  type: string;
  phone: Number;
  gender: string;
  registrationNumber: string;
  notifications: null;
  section?: string;
  subjects?: [string];
}

const UserModel = new Schema<IUser>({
  name: String,
  email: String,
  password: String,
  type: String,
  phone: Number,
  gender: String,
  registrationNumber: String,
  section: {
    type: Schema.Types.ObjectId,
    ref: "section",
  },
  subjects: [Schema.Types.ObjectId],
});

const sectionModel = new Schema({
  code: String,
  name: String,
  startdate: Date,
  enddate: Date,
  subjects: [{ type: Schema.Types.ObjectId, ref: "subject" }],
});

const subjectModel = new Schema({
  code: String,
  name: String,
  credits: Number,
  teacher: { type: Schema.Types.ObjectId, ref: "user" },
});

const User = model<IUser>("student", UserModel);
const Section = model("section", sectionModel);
const Subject = model("subject", subjectModel);

export { User, IUser, Section, Subject };
