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
// import verifyToken from "../middlewares/verifyToken.js";
import isVlidId from "../middlewares/isValidId.js";
import validateBody from "../helpers/validateBody.js";

import authenticate from "../middlewares/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", verifyContactOwner, getAllContacts);

contactsRouter.get("/:id", isVlidId, getOneContact);

contactsRouter.delete("/:id", isVlidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  isVlidId,
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isVlidId,

  updateStatusContact
);

export default contactsRouter;
