const express = require("express")
const { adminController } = require("../controllers/adminController")
const router = express.Router()


router.post("/delete/vendor", adminController)


module.exports = router