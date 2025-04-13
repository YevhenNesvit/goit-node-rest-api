import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await contactsService.listContacts(userId, req.query);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const contact = await contactsService.getContactById(id, userId);

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedContact = await contactsService.removeContact(id, userId);

    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = [
  validateBody(createContactSchema),
  async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;
      const userId = req.user.id;

      const newContact = await contactsService.addContact(
        name,
        email,
        phone,
        userId
      );

      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  },
];

export const updateContact = [
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const body = req.body;

      const updatedContact = await contactsService.updateContact(
        id,
        body,
        userId
      );

      if (!updatedContact) {
        throw HttpError(404, "Not found");
      }

      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  },
];

export const updateFavoriteStatus = [
  validateBody(updateFavoriteSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const updatedContact = await contactsService.updateStatusContact(
        id,
        req.body,
        userId
      );

      if (!updatedContact) {
        throw HttpError(404, "Not found");
      }

      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  },
];
