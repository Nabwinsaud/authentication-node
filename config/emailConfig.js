import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  service: "gmail",
  port: process.env.EMAIl_PORT,
  secure: false, // true for 465 port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter;
