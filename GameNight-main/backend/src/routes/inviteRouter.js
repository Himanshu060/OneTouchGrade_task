import nodemailer from "nodemailer";
import express from "express";
import GameNight from "../models/GameNight.js";
import { authorize } from "../middlewares/authorize.js";

const sendEmail = async (email, message) => {
  const mailConfig = {
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.NODE_PUBLIC_SENDINBLUE_USER,
      pass: process.env.NODE_PUBLIC_SENDINBLUE_KEY,
    },
  };
  const transporter = nodemailer.createTransport(mailConfig);
  const mailData = {
    from: '"Authenticator 🔒" <authenticator@gmail.com>',
    to: email,
    subject: "Login credentials",
    html: message,
  };
  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.error(err);
      return {
        error: {
          message: `Error sending email: ${err}`,
        },
      };
    }
    return {
      status: 200,
      message: `Email sent: ${info.response}`,
    };
  });
};

const router = express.Router();
router.post("/game_night/:id/invite", authorize("host"), async (req, res) => {
  try {
    const { email } = req.body;
    const gameNight = await GameNight.findById(req.params.id);
    if (!gameNight)
      return res.status(404).json({ message: "Game night not found" });

    const invitationMessage = `
      <h1>You're Invited to a Game Night!</h1>
      <p>You have been invited to join the game night titled <strong>${gameNight.title}</strong>.</p>
      <p><strong>Date:</strong> ${gameNight.date}</p>
      <p><strong>Time:</strong> ${gameNight.time}</p>
      <p><strong>Location:</strong> ${gameNight.location}</p>
      <p>We hope to see you there!</p>
    `;

    const emailResponse = await sendEmail(email, invitationMessage);

    if (emailResponse?.error) {
      return res.status(500).json({ message: emailResponse.error.message });
    }

    res.status(200).json({ message: `Invitation sent to ${email}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to send invitation", error: err.message });
  }
});

export default router;