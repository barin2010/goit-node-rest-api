import Contact from "../models/Contact.js";

const listContacts = (filter = {}) =>
  Contact.find(filter, "-createdAt -updatedAt");
const addContact = (data) => Contact.create(data);
const getContactById = (id) => Contact.findOne(id);
const updateContactId = (id, data) =>
  Contact.findOneAndUpdate(id, data, { new: true });
const removeContact = (id) => Contact.findOneAndDelete(id);
const updateFavoriteStatusContact = (id, data) =>
  Contact.findOneAndUpdate(id, data, { new: true });

export const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactId,
  updateFavoriteStatusContact,
};
