import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchrema = new Schema(
  {
    
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchrema.post("save", handleSaveError);
userSchrema.pre("findOneAndUpdate", setUpdateSettings);
userSchrema.post("findOneAndUpdate", handleSaveError);
const User = model("user", userSchrema);
export default User;
