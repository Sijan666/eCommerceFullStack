const express = require("express")
const { userController } = require("../controllers/userController")
const router = express.Router()


router.get("/products", userController)


module.exports = router