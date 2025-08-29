import nodemailer from "nodemailer";

import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
});

export const sendEmail = async (toEmail, subject, message) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        html: message,
    });
}