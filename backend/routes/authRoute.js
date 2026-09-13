const express = require("express");
const router = express.Router();
const {
  regController,
  loginController,
  verifyUserController,
} = require("../controllers/authControllers");

router.post("/reg", regController);
router.post("/login", loginController);
router.get("/verify/:token", verifyUserController);

module.exports = router;
