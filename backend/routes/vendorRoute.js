const express = require("express")
const { vendorController } = require("../controllers/vendorController")
const router = express.Router()


router.post("/create/products", vendorController)


module.exports = router