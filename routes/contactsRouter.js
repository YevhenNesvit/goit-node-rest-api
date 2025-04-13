import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteStatus,
} from "../controllers/contactsControllers.js";
import authMiddleware from "../helpers/authMiddleware.js";

const contactsRouter = express.Router();

// Додаємо middleware перевірки авторизації до всіх маршрутів
contactsRouter.use(authMiddleware);

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.post("/", createContact);
contactsRouter.put("/:id", updateContact);
contactsRouter.patch("/:id/favorite", updateFavoriteStatus);

export default contactsRouter;
