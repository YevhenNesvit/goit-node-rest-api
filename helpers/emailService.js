import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: UKR_NET_EMAIL,
    to: email,
    subject: "Підтвердження електронної пошти",
    html: `
      <h1>Дякуємо за реєстрацію!</h1>
      <p>Будь ласка, для підтвердження Вашої електронної пошти перейдіть за наступним посиланням:</p>
      <a href="${verificationLink}">Підтвердити пошту</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
