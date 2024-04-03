import express from "express";

import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import upload from "../middlewares/upload.js";

import {
  userRegisterSchema,
  userLoginSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userRegisterSchema),
  authControllers.register
);
authRouter.post(
  "/login",
  validateBody(userLoginSchema),

  authControllers.login
);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,

  authControllers.updateAvatar
);

export default authRouter;
