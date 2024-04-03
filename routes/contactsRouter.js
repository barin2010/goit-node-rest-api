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
import validateBody from "../helpers/validateBody.js";
import verifyContactOwner from "../middlewares/verifyContactOwner.js";
import authenticate from "../middlewares/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", verifyContactOwner, isVlidId, getOneContact);

contactsRouter.delete("/:id", verifyContactOwner, isVlidId, deleteContact);



contactsRouter.put(
  "/:id",
  verifyContactOwner,
  validateBody(updateContactSchema),
  isVlidId,
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  verifyContactOwner,
  isVlidId,
  updateStatusContact
);

export default contactsRouter;
