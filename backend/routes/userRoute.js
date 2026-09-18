const express = require("express")
const { updateprofileController, createCategory, allCategories } = require("../controllers/userController")
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

/**
 * @swagger
 * /api/v1/user/createcategory:
 *   post:
 *     summary: request a new category
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: success
 */
router.post("/createcategory", createCategory)

/**
 * @swagger
 * /api/v1/user/allcategories:
 *   get:
 *     summary: get all categories
 *     tags: [User]
 *     responses:
 *       200:
 *         description: success
 */
router.get("/allcategories", allCategories)

module.exports = router