import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import isVlidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isVlidId, getOneContact);

contactsRouter.delete("/:id", isVlidId, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", isVlidId, updateContact);

contactsRouter.patch("/:id/favorite", isVlidId, updateStatusContact);

export default contactsRouter;
