const express = require("express")
const router = express.Router()
const {registrationController,loginController,verifyController, forgetPasswordController} = require("../controllers/authControllers")

router.post("/registration", registrationController)
router.post("/login", loginController)
router.post("/verify/:token", verifyController)
router.post("/forgetpassword", forgetPasswordController)

module.exports = router