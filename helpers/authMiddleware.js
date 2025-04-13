import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Перевіряємо наявність заголовка авторизації
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    // Перевіряємо формат токена
    if (bearer !== "Bearer" || !token) {
      return next(HttpError(401, "Not authorized"));
    }

    try {
      // Перевіряємо валідність токена
      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      // Шукаємо користувача за ID
      const user = await User.findByPk(id);

      // Перевіряємо чи існує користувач та чи збігається токен
      if (!user || user.token !== token) {
        return next(HttpError(401, "Not authorized"));
      }

      // Додаємо об'єкт користувача в request
      req.user = user;
      next();
    } catch (error) {
      next(HttpError(401, "Not authorized"));
    }
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export default authMiddleware;
