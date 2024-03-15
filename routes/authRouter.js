import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSignupSchema, userSigninSchema } from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.use(authenticate);

authRouter.post(
  "/signup",
  validateBody(userSignupSchema),
  authControllers.signup
);
authRouter.post(
  "/signin",
  validateBody(userSigninSchema),

  authControllers.signin
);

export default authRouter;
