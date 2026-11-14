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
        let existingCart = await Cart.findOne({ productId: productId, owner });

        if (existingCart) {
            let total = existingCart.quantity + 1;

            if (total > existingProduct.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            }

            existingCart.quantity = existingCart.quantity + 1;
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

// increment or decrement cart quantity
const increDecre = async (req, res) => {
    try {
        let { cartId, quantity, owner, type } = req.body;

        let existingCart = await Cart.findOne({ _id: cartId, owner }).populate("productId");

        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        if (type == "plus") {
            let total = existingCart.quantity + quantity;

            if (total > existingCart.productId.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            } else {
                existingCart.quantity = existingCart.quantity + quantity;
            }

            existingCart.quantity = existingCart.quantity + 1;
        } else {
            if (existingCart.quantity > 1) {
                existingCart.quantity = existingCart.quantity - 1;
            } else {
                // delete cart if quantity becomes 0
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

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
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

module.exports = { createCart, increDecre, getCart };