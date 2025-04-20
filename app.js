import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db/db.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

connectDB();

const app = express();

app.use(morgan("tiny"));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
