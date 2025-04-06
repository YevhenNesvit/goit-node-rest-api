import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Використовуйте true в продакшені, якщо це можливо
    }
  },
  logging: false,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
    await sequelize.sync();
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
}

export { sequelize, connectDB };
