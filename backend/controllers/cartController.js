let Product = require('../models/productSchema');
let Cart = require('../models/cartSchema');

// create cart
const createCart = async (req, res) => {
    try {
        
        let { productId, quantity = 1, owner } = req.body;

        if (!productId || !owner) {
            return res.status(400).json({
                success: false,
                message: "Product ID and owner are required"
            });
        }

        let existingProduct = await Product.findOne({ _id: productId });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let existingCart = await Cart.findOne({ productId: productId, owner });

        if (existingCart) {

            let total = existingCart.quantity + Number(quantity);

            if (total > existingProduct.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            }

            // save updated cart quantity
            existingCart.quantity = total;
            await existingCart.save();
            return res.status(201).json({
                success: true,
                message: "Cart item quantity updated successfully",
                data: existingCart
            });
        }

        if (existingProduct.stock >= quantity) {
            console.log("Product available");

            let cart = await new Cart({
                productId,
                quantity,
                owner
            }).save();

            return res.status(201).json({
                success: true,
                message: "Product added to cart successfully",
                data: cart
            });
        } else {
            console.log("Product not available");

            return res.status(400).json({
                success: false,
                message: "Product is currently out of stock"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
            error: error.message
        });
    }
};

// increment or decrement
const increDecre = async (req, res) => {
    try {
        let { cartId, quantity, owner, type } = req.body;

        if (!cartId || !owner || !type) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            });
        }

        let existingCart = await Cart.findOne({ _id: cartId, owner }).populate("productId");

        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        // handle increment
        if (type == "plus") {
            let total = existingCart.quantity + Number(quantity);

            if (total > existingCart.productId.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            } else {
                existingCart.quantity = total;
            }
        } else if (type == "minus") {
            // handle decrement and remove if below 1
            existingCart.quantity = existingCart.quantity - Number(quantity);

            if (existingCart.quantity < 1) {
                // delete cart if quantity becomes less than 1
                await Cart.findByIdAndDelete(cartId);

                return res.status(200).json({
                    success: true,
                    message: "Item removed from cart"
                });
            }
        }

        await existingCart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: existingCart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update cart quantity",
            error: error.message
        });
    }
};

// get user cart
const getCart = async (req, res) => {
    try {
        let { owner } = req.params;

        let carts = await Cart.find({ owner }).populate("productId");

        console.log(carts);

        if (!carts || carts.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            count: carts.length,
            data: carts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart items",
            error: error.message
        });
    }
};

// delete product
const deleteProduct = async (req, res) => {
    try {
        let { productId } = req.params;

        // block deletion if product exists in any cart
        let existingInCart = await Cart.findOne({ productId });

        if (existingInCart) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete product because it is currently in a user's cart"
            });
        }

        // delete product
        let deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = { createCart, increDecre, getCart, deleteProduct };