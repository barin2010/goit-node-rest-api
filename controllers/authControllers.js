import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";
import * as authServises from "../services/authServises.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");
const tmpPath = path.resolve("tmp");

const register = async (req, res) => {
  const { email } = req.body;
  const avatarURL = gravatar.url(email);
  const user = await authServises.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServises.register({ ...req.body, avatarURL });
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
    return res.status(400).json({ message: "File not found, please add file" });
  }
  const { path: tmpUpload, originalname } = req.file;
  const image = await Jimp.read(tmpUpload);
  image.resize(250, 250).write(tmpUpload);
  const filename = `${id}_${originalname}`;
  const upload = path.join(avatarsPath, filename);
  await fs.rename(tmpUpload, upload);
  const avatarURL = path.join("avatars", filename);
  await authServises.updateUser({ _id: id }, { avatarURL });
  res.json({ avatarURL });
};

// const updateAvatar = async (req, res) => {
//   const { file } = req;
//   if (!file) {
//     throw HttpError(400, "No file uploaded");
//   }
//   const { _id: id } = req.user;

//   const ext = path.extname(file.originalname);
//   const avatarName = `avatar_${id}${ext}`;
//   const avatarTmpPath = path.join(tmpPath, avatarName);
//   const avatarResizedPath = path.join(avatarsPath, avatarName);

//   // Змінюємо розміри та зберігаємо аватарку
//   await Jimp.read(file.path).then((image) => {
//     return image
//       .cover(250, 250) // Робимо зображення 250x250
//       .writeAsync(avatarTmpPath); // Зберігаємо зображення
//   });

//   // Переміщуємо аватарку з tmp у public/avatars
//   await fs.rename(avatarTmpPath, avatarResizedPath);

//   const avatarURL = `/avatars/${avatarName}`;

//   await authServises.updateUser({ _id: id }, { avatarURL });

//   res.json({ avatarURL });
// };

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateAvatar: ctrlWrapper(updateAvatar),
};
