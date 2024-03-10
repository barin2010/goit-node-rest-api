import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isVlidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`));
  }
  next();
};

export default isVlidId;
