import request from "supertest";
import app from "../app.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jest } from '@jest/globals';

// Мокуємо модулі
jest.mock("../models/user.js");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("Login Controller", () => {
  let mockUser;

  beforeEach(() => {
    // Очистимо моки перед кожним тестом
    jest.clearAllMocks();

    // Підготуємо моковані дані
    mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
      subscription: "starter",
      token: null,
      update: jest.fn(),
    };

    // Налаштуємо моки
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("mocked-token");
  });

  test("повинен повертати 200 статус і валідні дані при успішному вході", async () => {
    // Налаштовуємо відповідь на update
    mockUser.update.mockResolvedValue({ ...mockUser, token: "mocked-token" });

    // Виконуємо запит
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    // Перевіряємо статус
    expect(response.status).toBe(200);

    // Перевіряємо, що у відповіді є токен
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");

    // Перевіряємо, що у відповіді є об'єкт користувача
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email");
    expect(typeof response.body.user.email).toBe("string");
    expect(response.body.user).toHaveProperty("subscription");
    expect(typeof response.body.user.subscription).toBe("string");
  });

  test("повинен повертати 401 статус при неправильних облікових даних", async () => {
    // Імітуємо неправильний пароль
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    // Виконуємо запит
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    // Перевіряємо статус
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });

  test("повинен повертати 401 статус коли користувача не знайдено", async () => {
    // Імітуємо відсутність користувача
    User.findOne = jest.fn().mockResolvedValue(null);

    // Виконуємо запит
    const response = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    // Перевіряємо статус
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });
});
