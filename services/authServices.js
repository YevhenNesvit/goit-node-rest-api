import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

async function registerUser(email, password) {
  // Перевіряємо, чи існує користувач з таким email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return { error: { status: 409, message: "Email in use" } };
  }

  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створюємо нового користувача
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  };
}

async function loginUser(email, password) {
  // Шукаємо користувача за email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { error: { status: 401, message: "Email or password is wrong" } };
  }

  // Перевіряємо пароль
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: { status: 401, message: "Email or password is wrong" } };
  }

  // Генеруємо токен
  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Зберігаємо токен в базі даних
  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
}

async function logoutUser(userId) {
  // Шукаємо користувача за ID
  const user = await User.findByPk(userId);
  if (!user) {
    return { error: { status: 401, message: "Not authorized" } };
  }

  // Видаляємо токен
  await user.update({ token: null });
  return { success: true };
}

async function getCurrentUser(userId) {
  // Шукаємо користувача за ID
  const user = await User.findByPk(userId);
  if (!user) {
    return { error: { status: 401, message: "Not authorized" } };
  }

  return {
    email: user.email,
    subscription: user.subscription,
  };
}

async function updateSubscription(userId, subscription) {
  // Шукаємо користувача за ID
  const user = await User.findByPk(userId);
  if (!user) {
    return { error: { status: 401, message: "Not authorized" } };
  }

  // Оновлюємо підписку
  await user.update({ subscription });

  return {
    email: user.email,
    subscription: user.subscription,
  };
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
};
