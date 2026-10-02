const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select : false
    },
    terms: {
      type: Boolean,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin" , "vendor"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
})

module.exports = mongoose.model("User", userSchema);