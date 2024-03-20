import HttpError from "../helpers/HttpError.js";
import * as contactServices from "../services/contactsServices.js";

const verifyContactOwner = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user.id;

  try {
    const contact = await contactServices.findContactById(contactId);
    if (!contact) {
      return next(HttpError(404, "Contact not found"));
    }

    if (contact.userId !== userId) {
      return next(HttpError(403, "You are not the owner of this contact"));
    }

    next();
  } catch (error) {
    return next(HttpError(500, "Internal server error"));
  }
};

export default verifyContactOwner;
