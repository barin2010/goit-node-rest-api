import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import multer from "multer";

import HttpError from "../helpers/HttpError.js";
import * as authServises from "../services/authServises.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");
const upload = multer({ dest: "tmp/" });

const register = async (req, res) => {
  const { email } = req.body;
  const avatarURL = gravatar.url(email);
  const user = await authServises.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServises.regiters({ ...req.body, avatarURL });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL,
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
    user: { email, subscription: user.subscription },
  });
};

const logout = async (req, res) => {
  const { _id: id } = req.user;
  await authServises.updateUser({ _id: id }, { token: "" });
  res.sendStatus(204);
};

const current = async (req, res) => {
  const { email } = req.user;

  res.json({
    email,
    subscription: req.user.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id: id } = req.user;

  if (!req.file) {
    return res.status(400).json({ message: "AvatarURL field is required" });
  }

  const { path: tmpUpload, originalname } = req.file;
  const image = await Jimp.read(tmpUpload);
  image.resize(250, 250).write(tmpUpload);
  const filename = `${id}_${originalname}`;
  const uploadPath = path.join(avatarsPath, filename);
  await fs.rename(tmpUpload, uploadPath);
  const avatarURL = path.join("avatars", filename);
  await authServises.updateUser({ _id: id }, { avatarURL });
  res.json({ avatarURL });
};


export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateAvatar: ctrlWrapper(updateAvatar),
};
