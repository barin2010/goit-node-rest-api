import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import HttpError from "../helpers/HttpError.js";
import * as authServises from "../services/authSerises.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

dotenv.config();

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServises.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServises.signup(req.body);
  res.status(201).json({
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServises.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = await authServises.validatePassword(
    password,
    user.password
  );
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;

  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  res.json({ token });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};
