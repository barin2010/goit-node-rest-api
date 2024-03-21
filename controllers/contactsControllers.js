import { contactsService } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await contactsService.listContacts({ owner });
  res.json(result);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.getContactById({
      _id: contactId,
      owner,
    });
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const deletedContact = await contactsService.removeContact({
      id,
      owner,
    });
    if (!deletedContact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;

  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const result = await contactsService.addContact({ ...req.body, owner });
  res.status(201).json(result);
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;

    const result = await contactsService.updateContactId(
      { id, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      throw HttpError(
        400,
        "Invalid value for 'favorite'. It should be a boolean."
      );
    }

    const updatedContact = await contactsService.updateFavoriteStatusContact(
      id,
      { favorite }
    );

    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
