import HttpError from "../helpers/HttpError.js";
import { contactsService } from "../services/contactsServices.js";

const verifyContactOwner = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    console.log("user id=", userId);

    const contactId = req.params.id;
    console.log("id params=", contactId);

    const contact = await contactsService.getContactById(contactId);
    const contactOwner = contact.owner.toString();
    console.log("owner=", contactOwner);

    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    if (contactOwner !== userId) {
      throw HttpError(403, "You are not the owner of this contact");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyContactOwner;
