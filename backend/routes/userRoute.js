const express = require("express")
const { updateprofileController } = require("../controllers/userController")
const { getSingleProduct, allproducts } = require("../controllers/productController")
const { ownerwisecategory, categorywisesubcategory, allsubCategories, allCategories } = require("../controllers/vendorController")
const { createCart, increDecre, getCart } = require("../controllers/cartController")
const { paymentController } = require("../controllers/paymentController")
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: user panel routes
 */

/**
 * @swagger
 * /api/v1/user/updateprofile:
 *   post:
 *     summary: update user profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post("/updateprofile", updateprofileController)
router.get('/allproducts', allproducts)
router.get("/single/product/:slug" , getSingleProduct)



router.get("/allcategories", allCategories)
router.get("/allsubcategories", allsubCategories)
router.get('/category/:id/subcategory', categorywisesubcategory)
router.get('/user/:id/category', ownerwisecategory)


router.post('/create/cart' , createCart)
router.post('/cart/incredecre' , increDecre)
router.get('/get/cart',getCart)


router.post('/payment' , paymentController)

module.exports = router