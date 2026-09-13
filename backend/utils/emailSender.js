const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, token) => {
    const info = await transporter.sendMail({
      from: `"Sijan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifying email",
      html: `Please verify your email by clicking the link below: http://localhost:5000/verify/${token}`,
    });
};

module.exports = sendEmail;