import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs-extra";
import Jimp from "jimp";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../helpers/emailService.js";

async function registerUser(email, password) {
  // Перевіряємо, чи існує користувач з таким email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return { error: { status: 409, message: "Email in use" } };
  }

  // Генеруємо URL аватарки через Gravatar
  const avatarURL = gravatar.url(email, { s: "250", d: "identicon", r: "pg" });

  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створюємо токен верифікації
  const verificationToken = uuidv4();

  // Створюємо нового користувача
  const newUser = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  // Відправляємо email для верифікації
  await sendVerificationEmail(email, verificationToken);

  return {
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  };
}

async function loginUser(email, password) {
  // Шукаємо користувача за email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { error: { status: 401, message: "Email or password is wrong" } };
  }

  // Перевіряємо верифікацію
  if (!user.verify) {
    return { error: { status: 401, message: "Email not verified" } };
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

async function verifyEmail(verificationToken) {
  // Шукаємо користувача за токеном верифікації
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) {
    return { error: { status: 404, message: "User not found" } };
  }

  // Оновлюємо користувача - верифікуємо email
  await user.update({ verify: true, verificationToken: null });

  return { message: "Verification successful" };
}

async function resendVerificationEmail(email) {
  // Шукаємо користувача за email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { error: { status: 404, message: "User not found" } };
  }

  // Перевіряємо, чи користувач вже верифікований
  if (user.verify) {
    return {
      error: {
        status: 400,
        message: "Verification has already been passed",
      },
    };
  }

  // Створюємо новий токен верифікації, якщо старий не існує
  const verificationToken = user.verificationToken || uuidv4();

  if (!user.verificationToken) {
    await user.update({ verificationToken });
  }

  // Відправляємо email для верифікації повторно
  await sendVerificationEmail(email, verificationToken);

  return { message: "Verification email sent" };
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

async function updateAvatar(userId, avatarPath) {
  try {
    // Знаходимо користувача
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: { status: 401, message: "Not authorized" } };
    }

    // Обробляємо зображення за допомогою jimp
    const image = await Jimp.read(avatarPath);
    // Змінюємо розмір
    await image.resize(250, 250);

    // Створюємо унікальне ім'я файлу
    const newName = `${uuidv4()}.jpg`;
    const avatarsDir = path.join(process.cwd(), "public", "avatars");

    // Переконуємося що папка існує
    await fs.ensureDir(avatarsDir);

    // Шлях для нового аватару
    const newAvatarPath = path.join(avatarsDir, newName);

    // Зберігаємо оброблене зображення
    await image.writeAsync(newAvatarPath);

    // Видаляємо тимчасовий файл
    await fs.remove(avatarPath);

    // URL для нового аватару
    const avatarURL = `/avatars/${newName}`;

    // Оновлюємо аватар користувача в базі даних
    await user.update({ avatarURL });

    return { avatarURL };
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
}

// Експортуємо новий сервіс
export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
};
