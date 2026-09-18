const express = require("express")
const router = express.Router()
const {registrationController,loginController,verifyController, forgetPasswordController, resetPasswordController} = require("../controllers/authControllers")

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: authentication routes
 */

/**
 * @swagger
 * /api/v1/auth/registration:
 *   post:
 *     summary: register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               terms:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: registration successful
 */
router.post("/registration", registrationController)

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: login successful
 */
router.post("/login", loginController)

/**
 * @swagger
 * /api/v1/auth/verify/{token}:
 *   post:
 *     summary: verify email token
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: account verified
 */
router.post("/verify/:token", verifyController)

/**
 * @swagger
 * /api/v1/auth/forgetpassword:
 *   post:
 *     summary: request forget password email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: email sent
 */
router.post("/forgetpassword", forgetPasswordController)

/**
 * @swagger
 * /api/v1/auth/resetpassword/{token}:
 *   post:
 *     summary: reset password
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
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
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: password reset successful
 */
router.post("/resetpassword/:token", resetPasswordController)

module.exports = router