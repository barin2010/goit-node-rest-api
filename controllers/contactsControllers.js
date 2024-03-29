import fs from "fs/promises";
import path from "path";

import { contactsService } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
// import { createContactSchema } from "../schemas/contactsSchemas.js";

const avatarsPath = path.resolve("public", "avatars");

console.log(avatarsPath);

export const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  // console.log(req.user);
  // console.log(req.file);

  // const { error } = createContactSchema.validate(req.body);
  // if (error) {
  //   return res.status(400).json({ error: error.details[0].message });
  // }
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("public", "avatars", filename);

  const result = await contactsService.addContact({
    ...req.body,
    avatarURL,
    owner,
  });
  res.status(201).json(result);
};

export const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await contactsService.listContacts({ owner });
  res.json(result);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.getContactById({
      id,
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
    const { _id: owner } = req.user;

    if (typeof favorite !== "boolean") {
      throw HttpError(
        400,
        "Invalid value for 'favorite'. It should be a boolean."
      );
    }

    const updatedContact = await contactsService.updateFavoriteStatusContact(
      id,
      owner,
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
