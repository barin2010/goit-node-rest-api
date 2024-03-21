import HttpError from "../helpers/HttpError.js";
import * as contactServices from "../services/contactsServices.js";

const verifyContactOwner = async (req, res, next) => {
  const contactId = req.params.id;
  const userId = req.user.id;
  console.log(contactId);
  console.log(userId);

  if (!contactId) {
    return next(HttpError(400, "Contact ID is missing"));
  }

  try {
    const contact = await contactServices.getContactById(contactId);

    if (!contact) {
      return next(HttpError(404, "Contact not found"));
    }

    if (contact.owner !== userId) {
      return next(HttpError(403, "You are not the owner of this contact"));
    }

    next();
  } catch (error) {
    return next(HttpError(500, "Internal server error"));
  }
};

export default verifyContactOwner;
