import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import * as authServises from "../services/authServises.js";

const { JWT_SECRET } = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(HttpError(401, "Authorization header missing"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;

  
    const user = await authServises.findUser({ email });
    if (!user || user.token !== token) {
      return next(HttpError(401, "Invalid token"));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return next(HttpError(401, "Invalid token"));
  }
};

export default verifyToken;
