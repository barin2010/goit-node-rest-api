import HttpError from "../helpers/HttpError.js";
import * as contactServices from "../services/contactsServices.js";
// import getContactById from "../services/contactsServices.js";
// const verifyContactOwner = async (req, res, next) => {
//   const contactId = req.params;
//   const userId = req.user.id;
//   console.log(contactId);
//   console.log(userId);

//   if (!contactId) {
//     return next(HttpError(400, "Contact ID is missing"));
//   }

//   try {
//     const contact = await contactServices.getContactById(contactId);

//     if (!contact) {
//       return next(HttpError(404, "Contact not found"));
//     }

//     if (contact.owner !== userId) {
//       return next(HttpError(403, "You are not the owner of this contact"));
//     }

//     next();
//   } catch (error) {
//     return next(HttpError(500, "Internal server error"));
//   }
// };

const verifyContactOwner = async (req, res, next) => {
  try {
    // Отримати ідентифікатор поточного користувача з об'єкта req.user
    const userId = req.user._id.toString();
    console.log("user id=", userId);

    // Отримати ідентифікатор контакту з параметрів маршруту
    const contactId = req.params.id;
    console.log("id params=", contactId);

    // Отримати інформацію про контакт з бази даних
    const contact = await contactServices.getContactById(contactId);
    const contactOwner = contact.toObject().owner;
    console.log(contactOwner);
    // Перевірити, чи знайдено контакт
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }

    // Перевірити, чи поточний користувач є власником контакту
    if (contactOwner !== userId) {
      throw HttpError(403, "You are not the owner of this contact");
    }

    // Якщо поточний користувач є власником контакту, дозволити виконання запиту
    next();
  } catch (error) {
    // Обробити будь-яку помилку і передати її до middleware обробника помилок
    next(error);
  }
};

export default verifyContactOwner;
