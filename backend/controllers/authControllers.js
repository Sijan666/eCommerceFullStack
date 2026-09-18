const User = require("../models/userSchema");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const bcrypt = require("bcrypt");
const {verificationEmail, forgetPassEmail} = require("../utils/emailSender");
const jwt = require("jsonwebtoken");


// registration
const registrationController = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, terms } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !terms) {
      return res.status(400).json({
        success: false,
        message: "please fill all the fields",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Use a valid email",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Use a valid password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password not matched",
      });
    }

    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      email: email,
      fullName: fullName,
      terms: terms,
      password: hashPassword,
    }).save();

    // jwt.sign({data,secret,expire})
    const token = jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
      },process.env.JWT_SECRET_ACCESS,
      { expiresIn: "10m" }
    );

    await verificationEmail  (email, token);

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Registration Error: ", error);
    return res.status(500).json({
      success: false,
      message: "server error", 
    });
  }
};


// verify
const verifyController = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "token is missing" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

    await User.findByIdAndUpdate(decoded._id, { isVerified: true });

    return res.status(200).json({
      success: true,
      message: "account verified successfully",
    });
  } catch (error) {
    console.error("Verification Error: ", error);
    
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "invalid or expired token" 
      }); 
    }

    return res.status(500).json({
      success: false,
      message: "server error"
    });
  }
};


// login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({email});

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "please verify your email first",
      });
    }

    const verifyPassword = await bcrypt.compare(password, existingUser.password);

    if (!verifyPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (verifyPassword) {
      // jwt.sign({data,secret,expire})
      const accessToken = jwt.sign({
          _id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },process.env.JWT_SECRET_ACCESS,
        { expiresIn: "30d" }
      );
      res.status(200).json({
        success: true,
        message: "Login Successful",
        data: { 
          _id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: existingUser.role,
        },
        accessToken : accessToken
      });
    }
  } catch (error) {
    console.error("Login Error: ", error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};


// forget
const forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "email is missing" 
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User not exist" 
      });
    }

    const forgetPassToken = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: "5m" }
    );

    await forgetPassEmail(email, forgetPassToken);

    res.status(200).json({
      success: true,
      message: "Please check your email",
    });
  } catch (error) {
    console.error("Forget Password Error: ", error);
    return res.status(500).json({ 
      success: false, 
      message: "server error" 
    });
  }
};


// reset
const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both new password and confirm password"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords not matched"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate({_id:decoded._id}, { password: hashPassword });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "invalid or expired token"
      });
    }

    return res.status(500).json({
      success: false,
      message: "server error"
    });
  }
};


module.exports = {registrationController,loginController,verifyController,forgetPasswordController,resetPasswordController};
