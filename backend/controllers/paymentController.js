const axios = require('axios')
let Cart = require('../models/cartSchema')
let Coupon = require('../models/couponSchema')
let Order = require('../models/orderSchema')

// create payment
const paymentController = async (req, res) => {
    try {

        let { desc, cus_name, cus_email, cus_add1, cus_add2, cus_city, cus_state, cus_postcode, cus_phone, owner, coupon } = req.body

        if (!desc || !cus_name || !cus_email || !cus_add1 || !cus_city || !cus_state || !cus_postcode || !cus_phone || !owner) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            })
        }

        let findCart = await Cart.find({ owner }).populate('productId').lean()

        if (!findCart) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            })
        }

        let total = 0

        // calculate total after product discount
        findCart.map((item) => {
            if (!item.productId) return

            if (item.productId.discountType == "percent") {
                let discountAmount = (item.productId.price * item.productId.discountPrice) / 100
                let afterDiscount = (item.productId.price - discountAmount) * item.quantity
                total += afterDiscount
            } else if (item.productId.discountType == "fixed") {
                let afterDiscount = (item.productId.price - item.productId.discountPrice) * item.quantity
                total += afterDiscount
            } else {
                total += item.productId.price * item.quantity
            }
        })

        // apply coupon if provided
        if (coupon) {
            let existingCoupon = await Coupon.findOne({ code: coupon })

            if (!existingCoupon) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid coupon code"
                })
            }

            if (total < existingCoupon.minimumAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Please add at least ${existingCoupon.minimumAmount} taka to use this coupon.`
                })
            }

            if (existingCoupon.couponType == "percent") {
                let afterTotal = (total * existingCoupon.couponAmount) / 100
                total = total - afterTotal
            } else if (existingCoupon.couponType == "fixed") {
                total = total - existingCoupon.couponAmount
            }
        }

        console.log(total);
        let tran_id = `eco_${Date.now()}`

        const payload = {
            store_id: "aamarpaytest",
            tran_id: tran_id,
            success_url: "http://www.merchantdomain.com/successpage.html",
            fail_url: "http://www.merchantdomain.com/failedpage.html",
            cancel_url: "http://www.merchantdomain.com/cancelpage.html",
            amount: total.toFixed(2),
            currency: "BDT",
            signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
            desc: desc || "Merchant Registration Payment",
            cus_name: cus_name || "Name",
            cus_email: cus_email || "payer@merchantcusomter.com",
            cus_add1: cus_add1 || "House B-158 Road 22",
            cus_add2: cus_add2 || "Mohakhali DOHS",
            cus_city: cus_city || "Dhaka",
            cus_state: cus_state || "Dhaka",
            cus_postcode: cus_postcode || "1206",
            cus_country: "Bangladesh",
            cus_phone: cus_phone || "+8801704",
            type: "json",
        };

        const response = await fetch("https://sandbox.aamarpay.com/jsonpost.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`aamarPay HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.result !== "true" && !data.payment_url) {
            return res.status(400).json({
                success: false,
                message: "Payment initiation rejected by gateway",
                details: data,
            });
        }

        let saveOrder = new Order({
            tran_id: tran_id,
            owner: owner,
            amount: total,
            coupon: coupon,
            desc: desc,
            products: findCart
        })

        await saveOrder.save()

        return res.status(200).json({
            success: true,
            payment_url: data.payment_url,
            data,
        });
    } catch (error) {
        console.error("aamarPay error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error while initiating payment",
            error: error.message,
        });
    }
}

// verify payment
const paymentVerifyController = async (req, res) => {
    try {
        let { tran_id, owner } = req.params

        if (!tran_id || !owner) {
            return res.status(400).json({
                success: false,
                message: "Please provide both tran_id and owner"
            })
        }

        // check transaction status
        const response = await axios.get(
            `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${tran_id}&store_id=aamarpaytest&signature_key=dbb74894e82415a2f7ff0ec3a97e4183&type=json`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        // update order status if failed
        if (response.data.pay_status == "Failed") {
            await Order.findOneAndUpdate(
                { tran_id: tran_id },
                { status: "failed" }
            )
            return res.status(400).json({
                success: false,
                message: "Payment failed"
            })
        }

        // update order status and clear cart if successful
        if (response.data.pay_status == "Successful") {
            let data = await Order.findOneAndUpdate({ tran_id: tran_id },{ status: "paid" },{ new: true })

            if (data) {
                await Cart.deleteMany({ owner: owner })
            }

            return res.status(200).json({
                success: true,
                message: "Payment Paid",
                order: data
            })
        }

        return res.status(400).json({
            success: false,
            message: `Unhandled payment status: ${response.data.pay_status}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `server error: ${error.message}`
        })
    }
}

module.exports = { paymentController, paymentVerifyController }