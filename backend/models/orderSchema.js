const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    tran_id: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    coupon: {
        type: String
    },
    desc: {
        type: String
    },
    products: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);