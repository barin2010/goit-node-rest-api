import Contact from "../models/Contact.js";

const listContacts = (filter = {}) =>
  Contact.find(filter, "-createdAt -updatedAt");
const addContact = (data) => Contact.create(data);
const getContactById = (id) => Contact.findById(id);
const updateContactId = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });
const removeContact = (id) => Contact.findByIdAndDelete(id);
const updateFavoriteStatusContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactId,
  updateFavoriteStatusContact,
};
