const express = require("express")
const { alluserController } = require("../controllers/adminController")
const router = express.Router()


router.post("/alluser", alluserController)


module.exports = router