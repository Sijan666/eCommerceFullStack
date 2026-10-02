const express = require("express")
const { createCategory, allCategories, createsubCategory, allsubCategories, categorywisesubcategory, ownerwisecategory } = require("../controllers/vendorController")
const router = express.Router()


router.post("/createcategory", createCategory)
router.post("/createsubcategory", createsubCategory)
router.get("/allcategories", allCategories)
router.get("/suballcategories", allsubCategories)
router.get('/category/:id/subcategory' , categorywisesubcategory)
router.get('/user/:id/category' , ownerwisecategory)

module.exports = router