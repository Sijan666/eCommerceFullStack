const express = require("express")
const { alluserController, deleteUserController } = require("../controllers/adminController")
const router = express.Router()


router.post("/alluser", alluserController)
router.delete("/deleteuser/:id", deleteUserController);


module.exports = router