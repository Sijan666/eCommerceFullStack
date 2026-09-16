const express = require("express")
const router = express.Router()
const {registrationController,loginController,verifyController, forgetPasswordController, resetPasswordController} = require("../controllers/authControllers")

router.post("/registration", registrationController)
router.post("/login", loginController)
router.post("/verify/:token", verifyController)
router.post("/forgetpassword", forgetPasswordController)
router.post("/resetpassword/:token", resetPasswordController)

module.exports = router