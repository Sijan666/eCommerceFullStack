const express = require("express")
const { createCategory, allCategories, createsubCategory, allsubCategories, categorywisesubcategory, ownerwisecategory } = require("../controllers/vendorController")
const { createproduct, allproducts, categoryWiseProducts, ownerWiseProducts, subCategoryWiseProducts, deleteProduct, bulkProductUpload, updateProduct } = require("../controllers/productController")
const router = express.Router()
const upload = require('../utils/storage');

/**
 * @swagger
 * tags:
 *   - name: Vendor
 *     description: Vendor category and subcategory routes
 *   - name: Product
 *     description: Product management routes
 */

/**
 * @swagger
 * /api/v1/vendor/createcategory:
 *   post:
 *     summary: Create a new category
 *     tags: [Vendor]
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
 *         description: Category created successfully
 */
router.post("/createcategory", createCategory)

/**
 * @swagger
 * /api/v1/vendor/createsubcategory:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: ID of the parent category
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */
router.post("/createsubcategory", createsubCategory)

/**
 * @swagger
 * /api/v1/vendor/allcategories:
 *   get:
 *     summary: Get all categories
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Successfully fetched all categories
 */
router.get("/allcategories", allCategories)

/**
 * @swagger
 * /api/v1/vendor/suballcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Successfully fetched all subcategories
 */
router.get("/suballcategories", allsubCategories)

/**
 * @swagger
 * /api/v1/vendor/category/{id}/subcategory:
 *   get:
 *     summary: Get subcategories by category ID
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/category/:id/subcategory', categorywisesubcategory)

/**
 * @swagger
 * /api/v1/vendor/user/{id}/category:
 *   get:
 *     summary: Get categories by owner/user ID
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/user/:id/category', ownerwisecategory)


// ==================== PRODUCT ROUTES ====================

/**
 * @swagger
 * /api/v1/vendor/createproduct:
 *   post:
 *     summary: Create a new product with images
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 5 images
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/createproduct", upload.array('image', 5), createproduct);

/**
 * @swagger
 * /api/v1/vendor/allproducts:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Successfully fetched all products
 */
router.get('/allproducts', allproducts)

/**
 * @swagger
 * /api/v1/vendor/product/delete/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete('/product/delete/:id', deleteProduct);

/**
 * @swagger
 * /api/v1/vendor/product/category/{id}:
 *   get:
 *     summary: Get products by category ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/product/category/:id', categoryWiseProducts)

/**
 * @swagger
 * /api/v1/vendor/product/subcategory/{id}:
 *   get:
 *     summary: Get products by subcategory ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/product/subcategory/:id', subCategoryWiseProducts)

/**
 * @swagger
 * /api/v1/vendor/product/owner/{id}:
 *   get:
 *     summary: Get products by owner ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/product/owner/:id', ownerWiseProducts)

/**
 * @swagger
 * /api/v1/vendor/bulk/productupload:
 *   post:
 *     summary: Bulk upload products via CSV/Excel file
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Upload the bulk product file
 *     responses:
 *       200:
 *         description: Bulk upload successful
 */
router.post('/bulk/productupload', upload.single('file'), bulkProductUpload)

/**
 * @swagger
 * /api/v1/vendor/updateproduct/{id}:
 *   post:
 *     summary: Update an existing product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload new photos (if any)
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.post("/updateproduct/:id", upload.array("photo"), updateProduct);

module.exports = router