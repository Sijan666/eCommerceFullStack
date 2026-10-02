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


module.exports = router