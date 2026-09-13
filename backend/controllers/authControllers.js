const User = require("../models/userSchema");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/emailSender");
const jwt = require("jsonwebtoken");

const regController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, terms } = req.body;
    if (!email || !password || !terms) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid email",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain letter and number",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }

    const hashPassword = bcrypt.hashSync(password, 5);

    const user = new User({ email, terms, name, password: hashPassword });
    await user.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    sendEmail(email, token);

    return res.status(201).json({
      success: true,
      message: "Register success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credential",
      });
    }
    const passwordVerify = await bcrypt.compare(password, user.password);
    if (!passwordVerify) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credential",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      data: { _id: user._id, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyUserController = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please send token",
      });
    }

    const decode = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
    const user = await User.findById(decode._id);
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    user.isVerified = true;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  regController,
  loginController,
  verifyUserController,
};
