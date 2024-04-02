import bcrypt from "bcrypt";

import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const regiters = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const validatePassword = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const findById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error("User not found");
  }
};

export const updateUser = (filter, data) =>
  User.findOneAndUpdate(filter, data, { new: true });
