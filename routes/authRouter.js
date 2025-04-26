import express from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authControllers.js";
import authMiddleware from "../helpers/authMiddleware.js";
import upload from "../helpers/uploadMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrent);
authRouter.patch("/subscription", authMiddleware, updateSubscription);
authRouter.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  updateAvatar
);

authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verify", resendVerificationEmail);

export default authRouter;
