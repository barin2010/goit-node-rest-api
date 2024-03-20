import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import verifyContactOwner from "../middlewares/verifyContactOwner.js";
import verifyToken from "../middlewares/verifyToken.js";

import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", verifyToken, getAllContacts);

contactsRouter.get("/:id", verifyContactOwner, getOneContact);

contactsRouter.delete("/:id", verifyContactOwner, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", verifyContactOwner, updateContact);

contactsRouter.patch(
  "/:id/favorite",

  updateStatusContact
);

export default contactsRouter;
