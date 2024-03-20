import jwt from "jsonwebtoken";
import "dotenv/config";

import HttpError from "../helpers/HttpError.js";
import * as authServises from "../services/authServises.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServises.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServises.register(req.body);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
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

  const payload = { id, email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await authServises.updateUser({ _id: id }, { token });
  res.json({
    token,
    user: { username: user.username, email, subscription: user.subscription },
  });
};

const logout = async (req, res) => {
  const { _id: id } = req.user;
  await authServises.updateUser({ _id: id }, { token: "" });
  res.sendStatus(204);
};

const current = async (req, res) => {
  const { username, email } = req.user;

  res.json({
    email,
    username,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
};
