const express = require("express")
const router = express.Router()
const {registrationController,loginController,verifyController} = require("../controllers/authControllers")

router.post("/registration", registrationController)
router.post("/login", loginController)
router.get("/verify/:token", verifyController)

module.exports = router