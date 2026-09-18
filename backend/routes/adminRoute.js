const express = require("express")
const { alluserController, deleteUserController, singleUserController, activeUserController, deactiveUserController, updateUserController, updateCategory, deleteCategory } = require("../controllers/adminController")
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: admin control routes
 */

/**
 * @swagger
 * /api/v1/admin/alluser:
 *   get:
 *     summary: get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: success
 */
router.get("/alluser", alluserController)

/**
 * @swagger
 * /api/v1/admin/deleteuser/{id}:
 *   delete:
 *     summary: delete a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: success
 */
router.delete("/deleteuser/:id", deleteUserController);

/**
 * @swagger
 * /api/v1/admin/singleuser/{id}:
 *   get:
 *     summary: get single user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: success
 */
router.get("/singleuser/:id", singleUserController);

/**
 * @swagger
 * /api/v1/admin/activeuser:
 *   get:
 *     summary: get all active users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: success
 */
router.get("/activeuser", activeUserController);

/**
 * @swagger
 * /api/v1/admin/deactiveuser:
 *   get:
 *     summary: get all deactive users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: success
 */
router.get("/deactiveuser", deactiveUserController);

/**
 * @swagger
 * /api/v1/admin/updateuser/{id}:
 *   post:
 *     summary: update a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post("/updateuser/:id", updateUserController);

/**
 * @swagger
 * /api/v1/admin/updatecategory/{id}:
 *   post:
 *     summary: update a category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post("/updatecategory/:id", updateCategory);

/**
 * @swagger
 * /api/v1/admin/deletecategory/{id}:
 *   delete:
 *     summary: delete a category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: success
 */
router.delete("/deletecategory/:id", deleteCategory);

module.exports = router