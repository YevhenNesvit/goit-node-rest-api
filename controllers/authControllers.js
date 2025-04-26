import * as authService from "../services/authServices.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  verifyEmailSchema,
} from "../schemas/authSchemas.js";
import HttpError from "../helpers/HttpError.js";

export const register = [
  validateBody(registerSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.registerUser(email, password);

      if (result.error) {
        return next(HttpError(result.error.status, result.error.message));
      }

      res.status(201).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  },
];

export const login = [
  validateBody(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);

      if (result.error) {
        return next(HttpError(result.error.status, result.error.message));
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
];

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const result = await authService.verifyEmail(verificationToken);

    if (result.error) {
      return next(HttpError(result.error.status, result.error.message));
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = [
  validateBody(verifyEmailSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.resendVerificationEmail(email);

      if (result.error) {
        return next(HttpError(result.error.status, result.error.message));
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
];

export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await authService.logoutUser(userId);

    if (result.error) {
      return next(HttpError(result.error.status, result.error.message));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await authService.getCurrentUser(userId);

    if (result.error) {
      return next(HttpError(result.error.status, result.error.message));
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = [
  validateBody(subscriptionSchema),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { subscription } = req.body;
      const result = await authService.updateSubscription(userId, subscription);

      if (result.error) {
        return next(HttpError(result.error.status, result.error.message));
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
];

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Avatar is required");
    }

    const userId = req.user.id;
    const result = await authService.updateAvatar(userId, req.file.path);

    if (result.error) {
      return next(HttpError(result.error.status, result.error.message));
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
