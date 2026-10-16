const express = require("express")
const { createCategory, allCategories, createsubCategory, allsubCategories, categorywisesubcategory, ownerwisecategory } = require("../controllers/vendorController")
const { createproduct, allproducts, categoryWiseProducts, ownerWiseProducts, subCategoryWiseProducts, deleteProduct } = require("../controllers/productController")
const router = express.Router()
const upload = require('../utils/storage');

router.post("/createcategory", createCategory)
router.post("/createsubcategory", createsubCategory)
router.get("/allcategories", allCategories)
router.get("/suballcategories", allsubCategories)
router.get('/category/:id/subcategory' , categorywisesubcategory)
router.get('/user/:id/category' , ownerwisecategory)


// product
router.post("/createproduct", upload.array('image', 5), createproduct);
router.get('/allproducts',allproducts)
router.delete('/product/delete/:id', deleteProduct);
router.get('/product/category/:id' , categoryWiseProducts)
router.get('/product/subcategory/:id' , subCategoryWiseProducts)
router.get('/product/owner/:id', ownerWiseProducts)

module.exports = router