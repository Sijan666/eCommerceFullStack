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

async function verificationEmail(email , token) {
  try {
    const info = await transporter.sendMail({
      from: `"Sijan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifying email",
      html: `
        <h3>Hello!</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:5000/verify/${token}" target="_blank">Click here to verify</a>
      `,
    });
    
    console.log("Email sent successfully: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
}

async function forgetPassEmail(email , token) {
  try {
    const info = await transporter.sendMail({
      from: `"Sijan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Forget email",
      html: `
        <h3>Hello!</h3>
        <a href="http://localhost:5000/resetpassword/${token}" target="_blank">Click here to reset your password</a>
      `,
    });
    
    console.log("Email sent successfully: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
}


async function notifyAdminEmail(email, name) {
  try {
    const info = await transporter.sendMail({
      from: `"Sijan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "New Category Approval",
      html: `
        <h3>Hello Admin</h3>
        <p>A new category <b>${name}</b> has been created.</p>
      `,
    });
    
    console.log("Email sent successfully: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
}

module.exports = { verificationEmail, forgetPassEmail, notifyAdminEmail };